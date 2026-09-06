/**
 * Request-side helpers: the client address behind the SWA proxy, and a
 * pseudonymous key for rate limiting. Raw addresses are never stored.
 */
import { createHash } from 'node:crypto';
import type { HttpRequest } from '@azure/functions';

export const UNKNOWN_IP = 'unknown';

/** Strips a trailing :port from an IPv4 or bracketed IPv6 literal. */
function stripPort(address: string): string {
  if (address.startsWith('[')) {
    const end = address.indexOf(']');
    return end > 0 ? address.slice(1, end) : address;
  }
  const parts = address.split(':');
  return parts.length === 2 ? (parts[0] ?? address) : address;
}

export function clientIp(request: HttpRequest): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? request.headers.get('x-client-ip') ?? '';
  const first = forwarded.split(',')[0]?.trim() ?? '';
  return first ? stripPort(first) : UNKNOWN_IP;
}

export const hashIp = (ip: string): string => createHash('sha256').update(ip).digest('hex').slice(0, 32);

export const hourBucket = (now: Date): number => Math.floor(now.getTime() / 3_600_000);

export async function readForm(request: HttpRequest): Promise<FormData | null> {
  try {
    return await request.formData();
  } catch {
    return null;
  }
}
