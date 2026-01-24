// routes/api/regions.route.ts
import {
  Router,
  parseBody,
  parseCookie,
  json,
  CTXCookie,
} from "@bepalo/router";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { CTXMain } from "../../base";
import {
  getRegionDetails,
  getRegionalStats,
  createCity,
  updateCity,
  deleteCity,
  getCities,
  getSchools,
} from "../../services/region_admin.service";

export const regionsRouter = new Router<CTXMain>();

// Get region details (for region admin)
regionsRouter.handle<CTXCookie>("GET /:regionId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["region_admin", "super_admin"] }),
  async (req, { params, user }) => {
    const regionId = params.regionId;
    try {
      // Check if user has access to this region
      const region = await getRegionDetails(regionId);
      if (!region) {
        return json({ error: "Region not found" }, { status: 404 });
      }

      return json({ region, success: true });
    } catch (error) {
      return json({ error: "Failed to fetch region details" }, { status: 500 });
    }
  },
]);

// Get regional statistics
regionsRouter.handle<CTXCookie>("GET /:regionId/stats", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["region_admin", "super_admin"] }),
  async (req, { params }) => {
    const regionId = params.regionId;
    try {
      const stats = await getRegionalStats(regionId);
      return json({ stats, success: true });
    } catch (error) {
      return json(
        { error: "Failed to fetch regional statistics" },
        { status: 500 },
      );
    }
  },
]);

// Create city in region
regionsRouter.handle<
  CTXCookie & { body: { name: string; longitude: number; latitude: number } }
>("POST /:regionId/cities", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["region_admin"] }),
  parseBody({
    accept: ["application/json", "application/x-www-form-urlencoded"],
    maxSize: 1024,
  }),
  async (req, { params, body }) => {
    const regionId = params.regionId;
    const { name, longitude, latitude } = body;

    if (!name) {
      return json({ error: "City name is required" }, { status: 400 });
    }

    try {
      const city = await createCity(regionId, name, longitude, latitude);
      return json({ city, success: true }, { status: 201 });
    } catch (error: any) {
      if (error.message?.includes("unique constraint")) {
        return json(
          { error: "City name already exists in this region" },
          { status: 400 },
        );
      }
      return json({ error: "Failed to create city" }, { status: 500 });
    }
  },
]);

// Get cities in region
regionsRouter.handle<CTXCookie>("GET /:regionId/cities", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["region_admin", "super_admin"] }),
  async (req, { params }) => {
    const regionId = params.regionId;
    try {
      const cities = await getCities(regionId);
      return json({ cities, success: true });
    } catch (error) {
      return json({ error: "Failed to fetch cities" }, { status: 500 });
    }
  },
]);
