/**
 * POST /api/audit — the free site audit request.
 *
 * Order of operations, and why: honeypot first (bots get a success and
 * nothing else happens), validation, rate limit, then the lead is written
 * to the table before any email is attempted, because the log is the
 * record and email is the notification. The visitor sees success if the
 * lead landed anywhere; a 500 only when it landed nowhere.
 */
import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { loadConfig, type Config } from '../lib/config';
import { TableLeadStore, type LeadRecord, type LeadStore } from '../lib/leadLog';
import { attempt, logError, logEvent } from '../lib/logging';
import { AcsMailer, LogMailer, type Mailer } from '../lib/mail';
import { clientIp, hashIp, hourBucket, readForm, UNKNOWN_IP } from '../lib/request';
import { failure, invalid, RATE_LIMITED, SERVER_ERROR, success, wantsJson } from '../lib/respond';
import { ackMessage, hostOf, notifyMessage } from '../lib/templates';
import { fieldsFrom, isHoneypotTripped, oneLine, validateLead, type Lead } from '../lib/validate';

export interface Deps {
  config: Config;
  store: LeadStore;
  mailer: Mailer;
  now: () => Date;
}

interface Outcome {
  saved: boolean;
  notified: boolean;
}

async function overLimit(deps: Deps, context: InvocationContext, ip: string): Promise<boolean> {
  if (ip === UNKNOWN_IP) {
    // WHY fail open: with no address every visitor would share one bucket
    // and the sixth submission of the hour would lock the form for all.
    logEvent(context, 'audit.rate.skipped', { reason: 'no client address' });
    return false;
  }
  const key = `${hashIp(ip)}-${hourBucket(deps.now())}`;
  try {
    const count = await deps.store.incrementRate(key);
    return count > deps.config.ratePerHour;
  } catch (error: unknown) {
    logError(context, 'audit.rate', error);
    return false;
  }
}

async function capture(deps: Deps, context: InvocationContext, lead: Lead, request: HttpRequest, ip: string): Promise<Outcome> {
  const record: LeadRecord = {
    ...lead,
    receivedAt: deps.now().toISOString(),
    ipHash: hashIp(ip),
    userAgent: oneLine(request.headers.get('user-agent') ?? '').slice(0, 200),
  };
  const log = (line: string): void => context.log(line);
  const saved = await attempt(context, 'audit.store', () => deps.store.saveLead(record));
  const [notified, acknowledged] = await Promise.all([
    attempt(context, 'audit.notify', () => deps.mailer.send(notifyMessage(record, deps.config.notifyTo), log)),
    attempt(context, 'audit.ack', () => deps.mailer.send(ackMessage(record, deps.config.notifyTo), log)),
  ]);
  logEvent(context, 'audit.received', {
    host: hostOf(record.website),
    saved,
    notified,
    acknowledged,
    ipHash: record.ipHash.slice(0, 12),
  });
  return { saved, notified };
}

export function createHandler(getDeps: () => Deps) {
  return async function handleAudit(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const asJson = wantsJson(request);
    let deps: Deps;
    try {
      deps = getDeps();
    } catch (error: unknown) {
      logError(context, 'audit.config', error);
      return failure(asJson, 500, SERVER_ERROR);
    }
    const form = await readForm(request);
    if (!form) return failure(asJson, 400, `The form could not be read. Try again, or email ${deps.config.notifyTo}.`);
    if (isHoneypotTripped(form)) {
      logEvent(context, 'audit.dropped', { reason: 'honeypot' });
      return success(asJson, deps.config.thanksPath);
    }
    const result = validateLead(fieldsFrom(form));
    if (!result.ok) return invalid(asJson, result.errors);
    const ip = clientIp(request);
    if (await overLimit(deps, context, ip)) return failure(asJson, 429, RATE_LIMITED);
    const outcome = await capture(deps, context, result.lead, request, ip);
    if (!outcome.saved && !outcome.notified) return failure(asJson, 500, SERVER_ERROR);
    return success(asJson, deps.config.thanksPath);
  };
}

let cached: Deps | undefined;

/** Built on first use, so a configuration error is reported per request rather than crashing the worker at load. */
function productionDeps(): Deps {
  if (!cached) {
    const config = loadConfig();
    cached = {
      config,
      store: new TableLeadStore(config.tableConnectionString, config.tableName),
      mailer: config.mailTransport === 'log' ? new LogMailer() : new AcsMailer(config.mailConnectionString, config.mailFrom),
      now: () => new Date(),
    };
  }
  return cached;
}

app.http('audit', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'audit',
  handler: createHandler(productionDeps),
});
