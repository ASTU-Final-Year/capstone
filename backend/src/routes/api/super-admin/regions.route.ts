import {
  Router,
  parseBody,
  parseCookie,
  json,
  CTXCookie,
} from "@bepalo/router";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { CTXMain, Region } from "../../../base";
import {
  createRegion,
  updateRegion,
  deleteRegion,
  getAllRegions,
  getRegionById,
} from "../../../services/super_admin.service";

export const regionsRouter = new Router<CTXMain>();

// Get all regions
regionsRouter.handle<CTXCookie>("GET /", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  async () => {
    try {
      const regions = await getAllRegions();
      return json({ regions, success: true });
    } catch (error) {
      return json({ error: "Failed to fetch regions" }, { status: 500 });
    }
  },
]);

// Get region by ID
regionsRouter.handle<CTXCookie>("GET /:regionId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  async (req, { params }) => {
    const regionId = params.regionId;
    try {
      const region = await getRegionById(regionId);
      if (!region) {
        return json({ error: "Region not found" }, { status: 404 });
      }
      return json({ region, success: true });
    } catch (error) {
      return json({ error: "Failed to fetch region" }, { status: 500 });
    }
  },
]);

// Create region
regionsRouter.handle<
  CTXCookie & {
    body: Omit<Region, "id">;
  }
>("POST /", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  parseBody({
    accept: ["application/json", "application/x-www-form-urlencoded"],
    maxSize: 1024,
  }),
  async (req, { body }) => {
    const { name, code } = body;

    if (!name) {
      return json({ error: "Region name is required" }, { status: 400 });
    }

    try {
      const region = await createRegion(name, code);
      return json({ region, success: true }, { status: 201 });
    } catch (error: any) {
      if (error.message?.includes("unique constraint")) {
        return json(
          { error: "Region name or code already exists" },
          { status: 400 },
        );
      }
      return json({ error: "Failed to create region" }, { status: 500 });
    }
  },
]);

// Update region
regionsRouter.handle<
  CTXCookie & {
    body: Partial<Omit<Region, "id">>;
  }
>("PUT /:regionId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  parseBody({
    accept: ["application/json", "application/x-www-form-urlencoded"],
    maxSize: 1024,
  }),
  async (req, { params, body }) => {
    const regionId = params.regionId;
    const updates = body;

    try {
      const region = await updateRegion(regionId, updates);
      if (!region) {
        return json({ error: "Region not found" }, { status: 404 });
      }
      return json({ region, success: true });
    } catch (error: any) {
      if (error.message?.includes("unique constraint")) {
        return json(
          { error: "Region name or code already exists" },
          { status: 400 },
        );
      }
      return json({ error: "Failed to update region" }, { status: 500 });
    }
  },
]);

// Delete region
regionsRouter.handle<CTXCookie>("DELETE /:regionId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  async (req, { params }) => {
    const regionId = params.regionId;

    try {
      const deleted = await deleteRegion(regionId);
      if (!deleted) {
        return json({ error: "Region not found" }, { status: 404 });
      }
      return json({
        success: true,
        message: "Region deleted successfully",
      });
    } catch (error: any) {
      if (error.message?.includes("foreign key constraint")) {
        return json(
          { error: "Cannot delete region with associated data" },
          { status: 400 },
        );
      }
      return json({ error: "Failed to delete region" }, { status: 500 });
    }
  },
]);
