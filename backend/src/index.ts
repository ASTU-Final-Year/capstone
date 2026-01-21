import {
  cors,
  json,
  limitRate,
  Router,
  status,
  type CTXAddress,
  type RouterContext,
  type SocketAddress,
} from "@bepalo/router";
import { Time } from "@bepalo/time";

const port = parseInt(Bun.env.BACKEND_PORT || "") || 4000;
const url = Bun.env.URL || "http://localhost";
const isProduction = Bun.env.NODE_ENV === "production";

const router = new Router<RouterContext & CTXAddress>({
  defaultHeaders: [["x-powered-by", "@bepalo/router"]],
  defaultCatcher: isProduction
    ? undefined
    : (req, ctx) => {
        if (!isProduction) {
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
      origins: ["http://localhost:" + port, `${url}:${port}`],
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
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
    if (!isProduction) {
      console.error(error);
    }
    return json({ error: error.message, status: 500 }, { status: 500 });
  },
);

Bun.serve({
  port,
  development: !isProduction,
  reusePort: true,
  fetch: (req, server) => {
    const address = server.requestIP(req) as SocketAddress | null;
    if (!address) throw new Error("null client address");
    return router.respond(req, { address });
  },
});

console.log(`Backend server listening on ${url}:${port}`);
