/**
 * The validation boundary. Everything the browser sends is normalised to a
 * single line, length-limited, and shape-checked here before it is stored,
 * mailed, or logged. Client-side checks in public/scripts/audit.js are
 * usability only and mirror these messages.
 */
import { z } from 'zod';

export interface Lead {
  name: string;
  business: string;
  email: string;
  website: string;
  note: string;
}

export type LeadField = keyof Lead;
export type FieldErrors = Partial<Record<LeadField, string>>;

export const LIMITS: Readonly<Record<LeadField, number>> = {
  name: 100,
  business: 120,
  email: 200,
  website: 200,
  note: 300,
};

/**
 * Collapse whitespace and strip control characters (Unicode category Cc:
 * C0, DEL, and C1): one line, header-safe, log-safe.
 */
export const oneLine = (value: string): string =>
  value.replace(/\p{Cc}+/gu, ' ').replace(/\s+/g, ' ').trim();

/**
 * Accepts what people actually type ("example.com", "www.example.com/",
 * "https://example.com") and returns a canonical https URL, or null.
 */
export function normaliseWebsite(raw: string): string | null {
  const value = oneLine(raw);
  if (!value) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (url.username || url.password) return null;
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname)) return null;
  return url.href;
}

const tooLong = (max: number) => `Keep this under ${max} characters.`;

const line = (max: number, emptyMessage: string) =>
  z.string().transform(oneLine).pipe(z.string().min(1, emptyMessage).max(max, tooLong(max)));

export const LeadSchema = z.object({
  name: line(LIMITS.name, 'Enter your name.'),
  business: line(LIMITS.business, 'Enter your business name.'),
  email: z
    .string()
    .transform(oneLine)
    .pipe(z.email('Enter a valid email address.').max(LIMITS.email, tooLong(LIMITS.email))),
  website: line(LIMITS.website, 'Enter your website address.').transform((value, ctx) => {
    const url = normaliseWebsite(value);
    if (!url) {
      ctx.addIssue({ code: 'custom', message: 'Enter a website address like example.com.' });
      return z.NEVER;
    }
    return url;
  }),
  note: z
    .string()
    .optional()
    .default('')
    .transform(oneLine)
    .pipe(z.string().max(LIMITS.note, tooLong(LIMITS.note))),
});

export type ValidationResult = { ok: true; lead: Lead } | { ok: false; errors: FieldErrors };

const FIELD_NAMES: readonly LeadField[] = ['name', 'business', 'email', 'website', 'note'];

const asText = (value: ReturnType<FormData['get']>): string => (typeof value === 'string' ? value : '');

/** The five fields and nothing else; unknown keys never reach the schema. */
export function fieldsFrom(form: FormData): Record<LeadField, string> {
  return {
    name: asText(form.get('name')),
    business: asText(form.get('business')),
    email: asText(form.get('email')),
    website: asText(form.get('website')),
    note: asText(form.get('note')),
  };
}

/** The honeypot is a checkbox; any value at all means something ticked it. */
export function isHoneypotTripped(form: FormData): boolean {
  const value = form.get('botcheck');
  return value !== null && value !== '';
}

/**
 * Campaign tags from the landing URL, carried by public/scripts/source.js.
 * Not part of the Lead: the visitor never typed them, so they sit outside
 * the five-field schema and can never fail a submission.
 */
export interface LeadSource {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export const DIRECT = 'direct';

const TAG = /^[a-z0-9_-]{1,60}$/;

const SOURCE_KEYS = {
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
} as const satisfies Record<keyof LeadSource, string>;

export interface SourceResult {
  source: LeadSource;
  /** Posted tag names whose values failed the pattern; never the values. */
  dropped: string[];
}

/**
 * WHY drop rather than reject: a malformed tag is a broken campaign link,
 * not a visitor error, and must never cost the lead. With no valid tag at
 * all the lead is recorded as direct.
 */
export function sourceFrom(form: FormData): SourceResult {
  const source: LeadSource = { utmSource: '', utmMedium: '', utmCampaign: '' };
  const dropped: string[] = [];
  for (const [key, name] of Object.entries(SOURCE_KEYS) as Array<[keyof LeadSource, string]>) {
    const value = asText(form.get(name));
    if (TAG.test(value)) source[key] = value;
    else if (value !== '') dropped.push(name);
  }
  if (!source.utmSource && !source.utmMedium && !source.utmCampaign) source.utmSource = DIRECT;
  return { source, dropped };
}

export function validateLead(fields: Record<LeadField, string>): ValidationResult {
  const result = LeadSchema.safeParse(fields);
  if (result.success) return { ok: true, lead: result.data };
  const flat = z.flattenError(result.error).fieldErrors;
  const errors: FieldErrors = {};
  for (const field of FIELD_NAMES) {
    const first = flat[field]?.[0];
    if (first) errors[field] = first;
  }
  return { ok: false, errors };
}
