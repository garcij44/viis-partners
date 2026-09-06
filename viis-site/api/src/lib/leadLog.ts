/**
 * The lead log and the rate-limit counters, both in one Azure Table.
 *
 * Leads are partitioned by month with an inverted-time row key so the
 * newest sits first when the table is browsed. Rate counters live in a
 * single 'rate' partition keyed by hashed IP and hour bucket; the
 * read-then-write race is accepted at this volume.
 */
import { TableClient } from '@azure/data-tables';
import { randomUUID } from 'node:crypto';
import type { Lead } from './validate';

export interface LeadRecord extends Lead {
  receivedAt: string;
  ipHash: string;
  userAgent: string;
}

export interface LeadStore {
  saveLead(lead: LeadRecord): Promise<void>;
  /** Increments the counter for `key` and returns the new count. */
  incrementRate(key: string): Promise<number>;
}

interface RateEntity {
  partitionKey: string;
  rowKey: string;
  count: number;
}

const statusOf = (error: unknown): number | undefined =>
  typeof error === 'object' && error !== null && 'statusCode' in error
    ? Number((error as { statusCode: unknown }).statusCode)
    : undefined;

/** Larger timestamps sort first: the newest lead tops the table. */
const invertedMillis = (iso: string): string =>
  String(Number.MAX_SAFE_INTEGER - new Date(iso).getTime()).padStart(16, '0');

export class TableLeadStore implements LeadStore {
  private readonly client: TableClient;
  private ready: Promise<void> | undefined;

  constructor(connectionString: string, tableName: string) {
    // WHY allowInsecureConnection: Azurite serves plain http on 127.0.0.1;
    // a real account string is https and unaffected.
    const local = /UseDevelopmentStorage=true|127\.0\.0\.1|localhost/i.test(connectionString);
    this.client = TableClient.fromConnectionString(connectionString, tableName, {
      allowInsecureConnection: local,
    });
  }

  private ensureTable(): Promise<void> {
    this.ready ??= this.client.createTable().catch((error: unknown) => {
      this.ready = undefined;
      if (statusOf(error) !== 409) throw error;
    });
    return this.ready;
  }

  async saveLead(lead: LeadRecord): Promise<void> {
    await this.ensureTable();
    await this.client.createEntity({
      partitionKey: `lead-${lead.receivedAt.slice(0, 7)}`,
      rowKey: `${invertedMillis(lead.receivedAt)}-${randomUUID()}`,
      ...lead,
      status: 'new',
    });
  }

  async incrementRate(key: string): Promise<number> {
    await this.ensureTable();
    let count = 0;
    try {
      const entity = await this.client.getEntity<RateEntity>('rate', key);
      count = Number(entity.count) || 0;
    } catch (error: unknown) {
      if (statusOf(error) !== 404) throw error;
    }
    count += 1;
    await this.client.upsertEntity<RateEntity>({ partitionKey: 'rate', rowKey: key, count }, 'Replace');
    return count;
  }
}
