import {
  CTXBody,
  CTXCookie,
  parseBody,
  parseCookie,
  Router,
} from "@bepalo/router";
import { CTXSession, type CTXMain } from "../../base";
import { getUser, getUserById } from "../../handlers/user.handler";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

// TO-DO: implement user routes

export const userRouter = new Router<CTXMain>();

userRouter.handle<CTXCookie & CTXSession>("GET /", [
  parseCookie(),
  authenticate(),
  getUser(),
]);

userRouter.handle("GET /:userId", [getUserById()]);

// register user
userRouter.handle<CTXCookie & CTXBody & CTXSession>("POST /", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  parseBody({
    accept: ["application/x-www-form-urlencoded", "application/json"],
    maxSize: 1024, // 1KB
  }),
  (_req, { body }) => {
    console.log(body);
    // TO-DO: implement user registration
  },
]);

userRouter.handle("PATCH /", [parseBody(), () => {}]);
userRouter.handle("DELETE /", [parseBody(), () => {}]);
