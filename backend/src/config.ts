import { Time } from "@bepalo/time";

export const config = {
  emailDomain: Bun.env.EMAIL_DOMAIN || "choicex.gov.et",
};

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

export const dbConfig = {
  databaseURL:
    Bun.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/sturs",
};
