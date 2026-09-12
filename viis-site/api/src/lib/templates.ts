/**
 * The two emails. Plain text is the source of truth; the HTML is the same
 * words with paragraphs, every submitted value escaped. Sign-off per brief
 * §4: VIIS, LLC (d/b/a VIIS Partners).
 */
import type { LeadRecord } from './leadLog';
import type { Message } from './mail';

const SIGN_OFF = ['Jadrin Garcia', 'VIIS, LLC (d/b/a VIIS Partners)', 'jgarcia@viispartners.com'];

// Canonical value: src/data/audit.ts's AUDIT_POINT_COUNT. Not imported —
// viis-site/api deploys as an isolated package (Azure Static Web Apps
// builds api_location on its own; nothing outside it reaches the deployed
// function) — so this literal must be updated by hand whenever the count
// in src/data/audit.ts changes.
const AUDIT_POINT_COUNT = 15;

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const hostOf = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

const paragraphs = (lines: string[]): string =>
  lines.map((line) => `<p>${escapeHtml(line).replace(/\n/g, '<br>')}</p>`).join('\n');

const wrap = (body: string): string =>
  `<!doctype html><html lang="en"><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#121319">${body}</body></html>`;

export function ackMessage(lead: LeadRecord, replyTo: string): Message {
  const lines = [
    `Hi ${lead.name},`,
    `Your request for a free audit of ${hostOf(lead.website)} is in.`,
    `Here is what happens next. We run the ${AUDIT_POINT_COUNT}-point check across your site, the foundation under it (DNS, domain, and email authentication), search, and risk. Then we write it up and send you the report within three business days. No obligation, and the report is yours whether or not we work together.`,
    'We do all of this from the outside, using nothing but your domain — we never need access to your systems. A few things can only be checked from the inside, and the report tells you exactly which ones.',
    'If anything is urgent before then, reply to this email.',
    SIGN_OFF.join('\n'),
  ];
  return {
    to: lead.email,
    replyTo,
    subject: 'Your free site audit request',
    text: lines.join('\n\n'),
    html: wrap(paragraphs(lines)),
  };
}

export function notifyMessage(lead: LeadRecord, to: string): Message {
  const rows: Array<[string, string]> = [
    ['Name', lead.name],
    ['Business', lead.business],
    ['Email', lead.email],
    ['Website', lead.website],
    ['Note', lead.note || '(none)'],
    ['Received', lead.receivedAt],
  ];
  const text = ['New audit request', '', ...rows.map(([k, v]) => `${k}: ${v}`), '', 'Reply to this email to answer them directly.'].join('\n');
  const table = rows
    .map(([k, v]) => `<tr><th align="left" style="padding:4px 12px 4px 0">${k}</th><td>${escapeHtml(v)}</td></tr>`)
    .join('');
  return {
    to,
    replyTo: lead.email,
    subject: `Audit request: ${lead.business} (${hostOf(lead.website)})`,
    text,
    html: wrap(`<h1 style="font-size:18px">New audit request</h1><table>${table}</table><p>Reply to this email to answer them directly.</p>`),
  };
}
