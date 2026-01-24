import {
  clearCookie,
  json,
  setCookie,
  status,
  type CTXBody,
  type Handler,
} from "@bepalo/router";
import type { CTXMain } from "../base";
import type { CTXBodyLogin } from "../routes/api/session.route";
import {
  deleteSession as servDeleteSession,
  createSession as servCreateSession,
} from "../services/session.service";
import { authenticateUser } from "../services/user.service";
import { Time } from "@bepalo/time";
import { config, securityConfig } from "../config";

export const createSession =
  (): Handler<CTXMain & CTXBodyLogin> => async (_req, ctx) => {
    const { email, password } = ctx.body;
    const user = await authenticateUser(email, password);
    if (!user) {
      return json({ error: "Invalid login" }, { status: 401 });
    }
    const expires = Time.after(24).hours.fromNow()._ms;
    const sessionId = await servCreateSession(user.id, expires);
    return json(
      { sessionId, user, success: true },
      {
        status: 200,
        headers: [
          setCookie(securityConfig.sessionCookie, sessionId, {
            path: "/",
            httpOnly: true,
            secure: config.isProduction,
            expires: expires,
            sameSite: "Strict",
          }),
        ],
      },
    );
  };

export const deleteSession =
  (): Handler<CTXMain> =>
  async (_req, { session }) => {
    if (!session) return json({ error: "Not logged in" }, { status: 401 });
    const success = await servDeleteSession(session.id);
    return json(
      { success },
      { status: 200, headers: [clearCookie(securityConfig.sessionCookie)] },
    );
  };

export const getCurrentSession =
  (): Handler<CTXMain> =>
  (_req, { session }) => {
    if (!session) return json({ error: "Not logged in" }, { status: 401 });
    return json({ session, success: true }, { status: 200 });
  };
