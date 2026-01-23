import {
  authJWT,
  json,
  type CTXCookie,
  type CTXJWTAuth,
  type Handler,
  type RouterContext,
} from "@bepalo/router";
import {
  jwts,
  Permission,
  ROLES,
  PERMISSIONS,
  Role,
  type CTXSession,
  type Session,
  type User,
} from "../base";
import type { JWT, JwtPayload } from "@bepalo/jwt";
import { getUserAndSessionBySession } from "../services/session.service";
import { getUserWithAdminDetails } from "../services/user.service";

interface AuthenticateOptions {
  checkOnly?: boolean;
}

export const authenticate = (
  options?: AuthenticateOptions,
): Handler<RouterContext & CTXCookie & CTXSession> => {
  const checkOnly = options?.checkOnly;
  return async (req, ctx) => {
    let sessionId = ctx.cookie.sid;
    if (!sessionId) {
      const authorizaitonHeader = req.headers.get("authorization");
      if (authorizaitonHeader) {
        const [scheme, token] = authorizaitonHeader.split(" ", 2);
        if (scheme?.toLowerCase() === "bearer" && token) {
          const verifyResults = jwts.auth.verifySync(token);
          if (verifyResults.valid && verifyResults.payload) {
            sessionId = (verifyResults.payload as { sessionId: string })
              .sessionId;
          } else if (verifyResults.error) {
            // throw verifyResults.error;
            return checkOnly
              ? undefined
              : json({ error: verifyResults.error }, { status: 401 });
          }
        }
      }
    }
    if (!sessionId) {
      return checkOnly
        ? undefined
        : json({ error: "Authentication required" }, { status: 401 });
    } else {
      const userAndSession = await getUserAndSessionBySession(sessionId);
      if (!userAndSession) {
        return checkOnly
          ? undefined
          : json({ error: "Invalid or expired session" }, { status: 401 });
      }
      ctx.session = userAndSession.session;
      ctx.user = userAndSession.user;
    }
  };
};

export type AuthorizeOptionsWithRoles = {
  roles: Role[];
};
export type AuthorizeOptionsWithPermissions = {
  permissions: Permission;
};

export type AuthorizeOptions = { checkOnly?: boolean } & (
  | AuthorizeOptionsWithRoles
  | AuthorizeOptionsWithPermissions
);

export interface CTXAuthorize {
  permissions: Permission;
}

export const authorize = (
  options?: AuthorizeOptions,
  // validate?: ()
): Handler<RouterContext & CTXCookie & CTXSession> => {
  const checkOnly = options?.checkOnly;
  const roles = (options as AuthorizeOptionsWithRoles | undefined)?.roles;
  const permissions = (options as AuthorizeOptionsWithPermissions | undefined)
    ?.permissions;
  return async (req, { session, user }) => {
    if (!session) {
      return checkOnly
        ? undefined
        : json({ error: "Authentication required" }, { status: 401 });
    }
    const adminUser = await getUserWithAdminDetails(user.id);
    const role = adminUser.admin?.role;
    const userPermissions = role && PERMISSIONS[role];
    if (roles) {
      if (!roles.includes(role as Role)) {
        return checkOnly
          ? undefined
          : json({ error: "Unauthorized" }, { status: 403 });
      }
    } else if (permissions && userPermissions) {
      if (!validatePermissions(userPermissions, permissions)) {
        return checkOnly
          ? undefined
          : json({ error: "Unauthorized" }, { status: 403 });
      }
    } else {
      return checkOnly
        ? undefined
        : json({ error: "Unauthorized" }, { status: 403 });
    }
    // console.log(adminUser, options.roles, role);
  };
};

const validatePermissions = (
  permissions: Permission,
  withPermission: Permission,
) => {
  for (const [type, wPermission] of Object.entries(withPermission)) {
    const permission = permissions[type];
    if (!permission) {
      return false;
    }
    for (const [target, value] of Object.entries(wPermission)) {
      if (permission[target] !== value) {
        return false;
      }
    }
  }
  return true;
};
