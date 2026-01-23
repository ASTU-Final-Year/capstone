import { Time } from "@bepalo/time";

export const cacheConfig = {
  authTokenMaxAge: Time.for(1).Minutes,
  user: {
    maxAge: Time.for(60).Seconds,
    lruMaxSize: 40_000,
    cleanupInterval: Time.every(2).Seconds,
    expiryBucketSize: Time.every(2).Seconds,
  },
  session: {
    maxAge: Time.for(60).Seconds,
    lruMaxSize: 40_000,
    cleanupInterval: Time.every(2).Seconds,
    expiryBucketSize: Time.every(2).Seconds,
  },
  sessionBlacklist: {
    maxAge: Time.for(60).Seconds,
    lruMaxSize: 40_000,
    cleanupInterval: Time.every(2).Seconds,
    expiryBucketSize: Time.every(2).Seconds,
  },
};

export const securityConfig = {
  saltRounds: parseInt(Bun.env.SALT_ROUNDS || "") || 0,
  sessionCookie: "sid",
};
