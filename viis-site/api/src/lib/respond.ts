/**
 * Responses for both submit paths. A fetch submit sends Accept:
 * application/json and gets JSON; a plain form submit gets a redirect on
 * success and a small HTML page otherwise. SWA's global headers do not
 * apply to API responses, so the security headers are set here.
 */
import type { HttpRequest, HttpResponseInit } from '@azure/functions';
import { escapeHtml } from './templates';
import type { FieldErrors } from './validate';

export const CONTACT = 'jgarcia@viispartners.com';
export const SERVER_ERROR = `Something went wrong on our side. Email ${CONTACT} and we will run the audit from there.`;
export const RATE_LIMITED = `Too many requests from this connection. Try again in an hour, or email ${CONTACT}.`;

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
};

export const wantsJson = (request: HttpRequest): boolean =>
  (request.headers.get('accept') ?? '').includes('application/json');

const json = (status: number, body: unknown): HttpResponseInit => ({
  status,
  headers: SECURITY_HEADERS,
  jsonBody: body,
});

function htmlPage(status: number, title: string, lines: string[]): HttpResponseInit {
  const items = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head><body><main><h1>${escapeHtml(title)}</h1><ul>${items}</ul><p><a href="/#audit">Back to the form</a></p></main></body></html>`;
  return {
    status,
    headers: { ...SECURITY_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
    body,
  };
}

export const success = (asJson: boolean, thanksPath: string): HttpResponseInit =>
  asJson ? json(200, { ok: true }) : { status: 303, headers: { ...SECURITY_HEADERS, Location: thanksPath } };

export const failure = (asJson: boolean, status: number, message: string): HttpResponseInit =>
  asJson ? json(status, { ok: false, message }) : htmlPage(status, "That didn't go through", [message]);

export const invalid = (asJson: boolean, errors: FieldErrors): HttpResponseInit =>
  asJson
    ? json(400, { ok: false, errors })
    : htmlPage(400, 'Please check the form', Object.values(errors));
