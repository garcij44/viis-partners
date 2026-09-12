import { HttpRequest, InvocationContext } from '@azure/functions';
import type { Config } from '../src/lib/config';
import type { LeadRecord, LeadStore } from '../src/lib/leadLog';
import type { Mailer, Message } from '../src/lib/mail';
import type { Deps } from '../src/functions/audit';

export class MemoryStore implements LeadStore {
  leads: LeadRecord[] = [];
  counts = new Map<string, number>();
  failSave = false;
  failRate = false;
  async saveLead(lead: LeadRecord): Promise<void> {
    if (this.failSave) throw new Error('table unavailable');
    this.leads.push(lead);
  }
  async incrementRate(key: string): Promise<number> {
    if (this.failRate) throw new Error('table unavailable');
    const next = (this.counts.get(key) ?? 0) + 1;
    this.counts.set(key, next);
    return next;
  }
}

export class MemoryMailer implements Mailer {
  sent: Message[] = [];
  fail = false;
  async send(message: Message): Promise<void> {
    if (this.fail) throw new Error('mail unavailable');
    this.sent.push(message);
  }
}

export const testConfig: Config = {
  tableConnectionString: 'UseDevelopmentStorage=true',
  tableName: 'leads',
  mailTransport: 'log',
  mailConnectionString: '',
  mailFrom: 'audit@test.local',
  notifyTo: 'owner@test.local',
  ratePerHour: 5,
  thanksPath: '/thanks/',
};

export interface TestDeps extends Deps {
  store: MemoryStore;
  mailer: MemoryMailer;
}

export function makeDeps(): TestDeps {
  return {
    config: testConfig,
    store: new MemoryStore(),
    mailer: new MemoryMailer(),
    now: () => new Date('2026-09-05T12:00:00Z'),
  };
}

export const validFields = {
  name: 'Ada Lovelace',
  business: 'Lovelace Dental',
  email: 'ada@example.com',
  website: 'lovelacedental.com',
  note: 'Forms stopped arriving in June.',
};

export function formRequest(fields: Record<string, string>, options: { json?: boolean; ip?: string } = {}): HttpRequest {
  const headers: Record<string, string> = {
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': 'test-agent',
    'x-forwarded-for': options.ip ?? '203.0.113.7',
  };
  if (options.json !== false) headers.accept = 'application/json';
  return new HttpRequest({
    method: 'POST',
    url: 'http://localhost:7071/api/audit',
    headers,
    body: { string: new URLSearchParams(fields).toString() },
  });
}

export function makeContext(): { context: InvocationContext; lines: string[] } {
  const lines: string[] = [];
  const context = new InvocationContext({
    functionName: 'audit',
    invocationId: 'test',
    logHandler: (_level, ...args: unknown[]) => {
      lines.push(args.map(String).join(' '));
    },
  });
  return { context, lines };
}
