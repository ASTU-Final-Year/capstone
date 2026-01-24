import {
  cors,
  json,
  limitRate,
  Router,
  status,
  type SocketAddress,
} from "@bepalo/router";
import { Time } from "@bepalo/time";
import { userRouter } from "./routes/api/user.route";
import type { CTXMain } from "./base";
import { sessionRouter } from "./routes/api/session.route";
import { populateDb } from "./db";
import { superAdminRouter } from "./routes/api/super-admin";
import { config } from "./config";
import { adminsRouter } from "./routes/api/admins.route";
import { regionsRouter } from "./routes/api/regions.route";
import { citiesRouter } from "./routes/api/cities.route";

const router = new Router<CTXMain>({
  defaultHeaders: [["x-powered-by", "@bepalo/router"]],
  defaultCatcher: config.isProduction
    ? undefined
    : (_req, ctx) => {
        if (!config.isProduction) {
          console.error(ctx.error);
        }
        return status(500);
      },
  enable: {
    hooks: false,
    afters: false,
    filters: true,
    fallbacks: true,
    catchers: true,
  },
});

// limit rate of all requests.
router.filter("*", [
  limitRate({
    key: (_req, ctx) => ctx.address.address,
    maxTokens: 30,
    refillRate: 3,
    setXRateLimitHeaders: true,
  }),
]);

// limit rate and CORS of API calls.
router.filter(
  [
    "GET /api/.**",
    "POST /api/.**",
    "PUT /api/.**",
    "PATCH /api/.**",
    "DELETE /api/.**",
    "OPTIONS /api/.**",
  ],
  [
    limitRate({
      key: (_req, ctx) => ctx.address.address,
      maxTokens: 200,
      refillInterval: Time.every(60).seconds._ms,
      refillRate: 100,
      setXRateLimitHeaders: true,
    }),
    cors({
      origins: [
        `${config.url}:${config.port}`,
        `${config.url}:${config.frontendPort}`,
      ],
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
    () => true, // break from upper filters
  ],
);

router.catch(
  [
    "GET /api/.**",
    "POST /api/.**",
    "PUT /api/.**",
    "PATCH /api/.**",
    "DELETE /api/.**",
  ],
  (req, { error }) => {
    if (!config.isProduction) {
      console.error(error);
    }
    return json({ error: error.message, status: 500 }, { status: 500 });
  },
);

router.append("/api/user", userRouter);
router.append("/api/session", sessionRouter);
router.append("/api/admins", adminsRouter);
router.append("/api/super-admin", superAdminRouter);
router.append("/api/regions", regionsRouter);
router.append("/api/cities", citiesRouter);

Bun.serve({
  port: config.port,
  development: !config.isProduction,
  reusePort: true,
  fetch: async (req, server) => {
    const address = server.requestIP(req) as SocketAddress | null;
    if (!address) throw new Error("null client address");
    const resp = await router.respond(req, { address });
    console.log(`${req.method} ${req.url} ${resp.status} ${resp.statusText}`);
    return resp;
  },
});

populateDb();

console.log(`Backend server listening on ${config.url}:${config.port}`);
