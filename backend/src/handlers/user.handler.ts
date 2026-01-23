import { json, status, type Handler } from "@bepalo/router";
import type { CTXMain, User } from "../base";

export const registerSelf = (): Handler<CTXMain> => (req, ctx) => {
  return json({ success: true }, { status: 200 });
};

export const registerRegion = (): Handler<CTXMain> => (req, ctx) => {
  return json({ success: true }, { status: 200 });
};

export const registerCity = (): Handler<CTXMain> => (req, ctx) => {
  return json({ success: true }, { status: 200 });
};

export const registerSchool = (): Handler<CTXMain> => (req, ctx) => {
  return json({ success: true }, { status: 200 });
};

export const registerStudent = (): Handler<CTXMain> => (req, ctx) => {
  return json({ success: true }, { status: 200 });
};

export const updateUser = (): Handler<CTXMain> => (req, ctx) => {
  return json({ success: true }, { status: 200 });
};

export const getUser = (): Handler<CTXMain> => (req, ctx) => {
  ctx.user = { id: "" } as User;
  return json({ success: true }, { status: 200 });
};

export const getUserById = (): Handler<CTXMain> => (req, ctx) => {
  const { userId } = ctx.params;
  ctx.user = { id: userId } as User;
  return json({ success: true }, { status: 200 });
};
