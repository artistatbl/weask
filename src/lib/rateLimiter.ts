import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

type RateLimitConfig = {
  enabled: boolean;
  ratelimit: Ratelimit | null;
};

let ratelimitConfig: RateLimitConfig = {
  enabled: false,
  ratelimit: null,
};
if (process.env.UPSTASH_REDIS_REST_URL) {
  const redis = Redis.fromEnv();

  // Create a new ratelimiter, that allows 5 requests per 10 seconds
  const ratelimitFunction = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "10 s"),

    // limiter: Ratelimit.slidingWindow(5, "10 s", { useEval: true }), 
    // Force using EVAL instead of EVALSHA

    analytics: true,
    enableProtection: true,
    prefix: "app_rate_limit",
    // executableLua: "return redis.call('get', KEYS[1])",
    timeout: 1000, // 1 second timeout for Redis commands



  });

  ratelimitConfig = {
    enabled: true,
    ratelimit: ratelimitFunction,
  };
} else {
  console.error("Environment variable UPSTASH_REDIS_REST_URL is not set.");
  ratelimitConfig = {
    enabled: false,
    ratelimit: null,
  };
}

export { ratelimitConfig };
