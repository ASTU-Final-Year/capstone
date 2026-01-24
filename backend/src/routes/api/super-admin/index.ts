import { Router } from "@bepalo/router";
import { regionsRouter } from "./regions.route";
import { universitiesRouter } from "./universities.route";
import { adminsRouter } from "./admins.route";
import { statsRouter } from "./stats.route";
import { CTXMain } from "../../../base";

export const superAdminRouter = new Router<CTXMain>();

superAdminRouter.append("/regions", regionsRouter);
superAdminRouter.append("/universities", universitiesRouter);
superAdminRouter.append("/admins", adminsRouter);
superAdminRouter.append("/stats", statsRouter);
