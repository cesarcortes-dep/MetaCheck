import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const WINDOW = '60 s' as const;
const MAX_REQUESTS = 10;

export type RateLimitAllowed = {
  allowed: true;
  limit: number;
  remaining: number;
  reset: number;
};

export type RateLimitBlocked = {
  allowed: false;
  limit: number;
  remaining: 0;
  reset: number;
  retryAfter: number;
};

export type RateLimitResult = RateLimitAllowed | RateLimitBlocked;

let cached: Ratelimit | null | undefined;
let warnedMissingEnv = false;

function getRatelimiter(): Ratelimit | null {
  if (cached !== undefined) return cached;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (!warnedMissingEnv) {
      console.warn(
        '[rate-limit] UPSTASH_REDIS_REST_URL / _TOKEN not set — rate limiting is DISABLED for this runtime.',
      );
      warnedMissingEnv = true;
    }
    cached = null;
    return null;
  }

  const redis = new Redis({ url, token });
  cached = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, WINDOW),
    analytics: true,
    prefix: 'metacheck:analyze',
  });
  return cached;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const limiter = getRatelimiter();
  if (!limiter) {
    return {
      allowed: true,
      limit: Number.POSITIVE_INFINITY,
      remaining: Number.POSITIVE_INFINITY,
      reset: 0,
    };
  }
  const result = await limiter.limit(identifier);
  if (result.success) {
    return {
      allowed: true,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }
  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
  return {
    allowed: false,
    limit: result.limit,
    remaining: 0,
    reset: result.reset,
    retryAfter,
  };
}

export function extractClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'anonymous';
}
