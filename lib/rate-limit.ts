const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

const store = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(keyId: string): RateLimitResult {
  const now = Date.now();
  const timestamps = (store.get(keyId) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: timestamps[0] + WINDOW_MS };
  }

  timestamps.push(now);
  store.set(keyId, timestamps);
  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length, resetAt: now + WINDOW_MS };
}
