import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createHandler } from '../src/functions/audit';
import { ConfigError } from '../src/lib/config';
import { formRequest, makeContext, makeDeps, validFields, type TestDeps } from './fakes';

const run = (deps: TestDeps = makeDeps(), request = formRequest(validFields)) => {
  const { context, lines } = makeContext();
  return { deps, lines, response: createHandler(() => deps)(request, context) };
};

const headerOf = (headers: unknown, name: string): string | undefined =>
  headers && typeof headers === 'object' ? (headers as Record<string, string>)[name] : undefined;

describe('POST /api/audit', () => {
  it('stores the lead, notifies the owner, and acknowledges the visitor', async () => {
    const { deps, response } = run();
    const res = await response;
    assert.equal(res.status, 200);
    assert.deepEqual(res.jsonBody, { ok: true });
    assert.equal(deps.store.leads.length, 1);
    const lead = deps.store.leads[0]!;
    assert.equal(lead.website, 'https://lovelacedental.com/');
    assert.equal(lead.ipHash.length, 32);
    assert.equal(deps.mailer.sent.length, 2);
    assert.deepEqual(deps.mailer.sent.map((m) => m.to).sort(), ['ada@example.com', 'owner@test.local']);
    const notify = deps.mailer.sent.find((m) => m.to === 'owner@test.local')!;
    assert.equal(notify.replyTo, 'ada@example.com');
    assert.match(notify.subject, /Lovelace Dental \(lovelacedental\.com\)/);
    const ack = deps.mailer.sent.find((m) => m.to === 'ada@example.com')!;
    assert.equal(ack.replyTo, 'owner@test.local');
    assert.match(ack.text, /three business days/);
  });

  it('answers a navigation submit with a redirect to the thanks page', async () => {
    const res = await run(makeDeps(), formRequest(validFields, { json: false })).response;
    assert.equal(res.status, 303);
    assert.equal(headerOf(res.headers, 'Location'), '/thanks/');
  });

  it('drops a tripped honeypot silently', async () => {
    const { deps, lines, response } = run(makeDeps(), formRequest({ ...validFields, botcheck: 'on' }));
    assert.equal((await response).status, 200);
    assert.equal(deps.store.leads.length, 0);
    assert.equal(deps.mailer.sent.length, 0);
    assert.ok(lines.some((line) => line.includes('"audit.dropped"')));
  });

  it('rejects invalid fields with one message per field', async () => {
    const res = await run(makeDeps(), formRequest({ ...validFields, name: '  ', email: 'not-an-email', website: 'just words' })).response;
    assert.equal(res.status, 400);
    const body = res.jsonBody as { ok: boolean; errors: Record<string, string> };
    assert.equal(body.ok, false);
    assert.deepEqual(Object.keys(body.errors).sort(), ['email', 'name', 'website']);
    assert.equal(body.errors.name, 'Enter your name.');
  });

  it('renders validation errors as HTML on a navigation submit', async () => {
    const res = await run(makeDeps(), formRequest({ ...validFields, email: 'nope' }, { json: false })).response;
    assert.equal(res.status, 400);
    assert.match(String(res.body), /Enter a valid email address\./);
    assert.match(headerOf(res.headers, 'Content-Type') ?? '', /text\/html/);
  });

  it('accepts a full URL and treats the note as optional', async () => {
    const { deps, response } = run(makeDeps(), formRequest({ ...validFields, website: 'https://www.example.co.uk/path', note: '' }));
    assert.equal((await response).status, 200);
    assert.equal(deps.store.leads[0]!.website, 'https://www.example.co.uk/path');
    assert.equal(deps.store.leads[0]!.note, '');
  });

  it('flattens control characters so nothing submitted can break a header', async () => {
    const { deps, response } = run(makeDeps(), formRequest({ ...validFields, business: 'Evil\r\nBcc: x@y.z' }));
    assert.equal((await response).status, 200);
    assert.equal(deps.store.leads[0]!.business, 'Evil Bcc: x@y.z');
  });

  it('escapes submitted values in the HTML email', async () => {
    const { deps, response } = run(makeDeps(), formRequest({ ...validFields, name: '<script>x</script>' }));
    assert.equal((await response).status, 200);
    const notify = deps.mailer.sent.find((m) => m.to === 'owner@test.local')!;
    assert.ok(notify.html.includes('&lt;script&gt;'));
    assert.ok(!notify.html.includes('<script>'));
  });

  it('rate-limits the sixth submission from one address in an hour', async () => {
    const deps = makeDeps();
    for (let i = 0; i < 5; i += 1) assert.equal((await run(deps).response).status, 200);
    assert.equal((await run(deps).response).status, 429);
    assert.equal((await run(deps, formRequest(validFields, { ip: '198.51.100.9' })).response).status, 200);
  });

  it('still succeeds when the table is down but the notification went out', async () => {
    const deps = makeDeps();
    deps.store.failSave = true;
    assert.equal((await run(deps).response).status, 200);
    assert.equal(deps.mailer.sent.length, 2);
  });

  it('fails loudly when the lead landed nowhere', async () => {
    const deps = makeDeps();
    deps.store.failSave = true;
    deps.mailer.fail = true;
    const res = await run(deps).response;
    assert.equal(res.status, 500);
    assert.equal((res.jsonBody as { ok: boolean }).ok, false);
  });

  it('reports a configuration error instead of pretending', async () => {
    const { context } = makeContext();
    const handler = createHandler(() => {
      throw new ConfigError('Missing application settings: MAIL_FROM');
    });
    assert.equal((await handler(formRequest(validFields), context)).status, 500);
  });

  it('fails open on rate limiting when the counter store is down', async () => {
    const deps = makeDeps();
    deps.store.failRate = true;
    assert.equal((await run(deps).response).status, 200);
  });
});
