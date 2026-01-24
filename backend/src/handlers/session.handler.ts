import {
  clearCookie,
  json,
  setCookie,
  status,
  type CTXBody,
  type Handler,
} from "@bepalo/router";
import { isProduction, type CTXMain } from "../base";
import type { CTXBodyLogin } from "../routes/api/session.route";
import {
  deleteSession as servDeleteSession,
  createSession as servCreateSession,
} from "../services/session.service";
import { authenticateUser } from "../services/user.service";
import { Time } from "@bepalo/time";
import { securityConfig } from "../config";

export const createSession =
  (): Handler<CTXMain & CTXBodyLogin> => async (_req, ctx) => {
    const { email, password } = ctx.body;
    const user = await authenticateUser(email, password);
    if (!user) {
      return json({ error: "Invalid login" }, { status: 401 });
    }
    const sessionId = await servCreateSession(user.id);
    return json(
      { sessionId, user, success: true },
      {
        status: 200,
        headers: [
          setCookie(securityConfig.sessionCookie, sessionId, {
            path: "/",
            httpOnly: true,
            secure: isProduction,
            expires: Time.after(24).hours.fromNow()._ms,
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
