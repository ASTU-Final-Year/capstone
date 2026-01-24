import {
  Handler,
  json,
  parseBody,
  parseCookie,
  Router,
  type CTXBody,
  type CTXCookie,
} from "@bepalo/router";
import z, { success } from "zod";
import { type CTXMain } from "../../base";
import {
  createSession,
  deleteSession,
  getCurrentSession,
} from "../../handlers/session.handler";
import { authenticate } from "../../middlewares/auth.middleware";

const validateLogin =
  (): Handler<CTXBody> =>
  (req, { body }) => {
    try {
      z.object({
        email: z.email(),
        password: z.string().min(6),
      }).parse(body);
    } catch {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }
  };

export interface CTXBodyLogin {
  body: {
    email: string;
    password: string;
  };
}

export const sessionRouter = new Router<CTXMain>();

// get current session
sessionRouter.handle<CTXCookie>(
  ["GET /"],
  [parseCookie(), authenticate(), getCurrentSession()],
);

// create a new session or get existing. (Login)
sessionRouter.handle<CTXCookie & CTXBodyLogin>(
  ["POST /"],
  [
    parseBody({
      accept: ["application/x-www-form-urlencoded", "application/json"],
      maxSize: 1024, // 1KB
    }),
    validateLogin(),
    createSession(),
  ],
);

// delete the session. (Logout)
sessionRouter.handle<CTXCookie>(
  ["DELETE /"],
  [parseCookie(), authenticate(), deleteSession()],
);
