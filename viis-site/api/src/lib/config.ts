/**
 * Runtime configuration, read once from application settings.
 *
 * Every credential is an environment variable; nothing is defaulted that
 * could send a lead somewhere unintended. A missing required setting is a
 * ConfigError, which the handler turns into a 500 with a clear log line,
 * so a half-configured deployment fails loudly instead of dropping leads.
 */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export type MailTransport = 'acs' | 'log';

export interface Config {
  readonly tableConnectionString: string;
  readonly tableName: string;
  readonly mailTransport: MailTransport;
  readonly mailConnectionString: string;
  readonly mailFrom: string;
  readonly notifyTo: string;
  readonly ratePerHour: number;
  readonly thanksPath: string;
}

export const DEFAULT_NOTIFY_TO = 'jgarcia@viispartners.com';

const read = (env: NodeJS.ProcessEnv, key: string): string => env[key]?.trim() ?? '';

function parseTransport(value: string): MailTransport {
  const transport = value || 'acs';
  if (transport !== 'acs' && transport !== 'log') {
    throw new ConfigError(`MAIL_TRANSPORT must be "acs" or "log", got "${transport}".`);
  }
  return transport;
}

function parsePositiveInt(value: string, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) {
    throw new ConfigError(`RATE_LIMIT_PER_HOUR must be a positive integer, got "${value}".`);
  }
  return n;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const mailTransport = parseTransport(read(env, 'MAIL_TRANSPORT'));
  const required = ['LEADS_TABLE_CONNECTION_STRING'];
  if (mailTransport === 'acs') required.push('MAIL_CONNECTION_STRING', 'MAIL_FROM');
  const missing = required.filter((key) => !read(env, key));
  if (missing.length > 0) {
    throw new ConfigError(
      `Missing application settings: ${missing.join(', ')}. See api/local.settings.example.json and the README.`,
    );
  }
  return {
    tableConnectionString: read(env, 'LEADS_TABLE_CONNECTION_STRING'),
    tableName: read(env, 'LEADS_TABLE_NAME') || 'leads',
    mailTransport,
    mailConnectionString: read(env, 'MAIL_CONNECTION_STRING'),
    mailFrom: read(env, 'MAIL_FROM') || 'audit@localhost',
    notifyTo: read(env, 'MAIL_NOTIFY_TO') || DEFAULT_NOTIFY_TO,
    ratePerHour: parsePositiveInt(read(env, 'RATE_LIMIT_PER_HOUR'), 5),
    thanksPath: '/thanks/',
  };
}
