/** Structured log lines. Never a raw lead field: hostnames and hashes only. */
import type { InvocationContext } from '@azure/functions';

export function logEvent(context: InvocationContext, event: string, fields: Record<string, unknown> = {}): void {
  context.log(JSON.stringify({ event, ...fields }));
}

const describe = (error: unknown): Record<string, unknown> => {
  if (error instanceof Error) {
    const withStatus = error as Error & { statusCode?: unknown; code?: unknown };
    return { name: error.name, message: error.message, statusCode: withStatus.statusCode, code: withStatus.code };
  }
  return { message: String(error) };
};

export function logError(context: InvocationContext, event: string, error: unknown): void {
  context.error(JSON.stringify({ event, error: describe(error) }));
}

/** Runs `work`, logs a failure under `event`, and reports success as a boolean. */
export async function attempt(context: InvocationContext, event: string, work: () => Promise<void>): Promise<boolean> {
  try {
    await work();
    return true;
  } catch (error: unknown) {
    logError(context, event, error);
    return false;
  }
}
