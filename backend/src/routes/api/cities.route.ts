// routes/api/city.route.ts
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
  getCityDetails,
  getCityStats,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchools,
  getStudents,
  getStudentSubmissions,
} from "../../services/city_admin.service";

export const citiesRouter = new Router<CTXMain>();

// Get city details (for city admin dashboard)
citiesRouter.handle<CTXCookie>("GET /:cityId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["city_admin", "super_admin", "region_admin"] }),
  async (req, { params, user }) => {
    const cityId = params.cityId;

    try {
      // Verify user has access to this city
      // You might want to check if the user's admin targetId matches this cityId

      const city = await getCityDetails(cityId);
      if (!city) {
        return json({ error: "City not found" }, { status: 404 });
      }

      return json({ city, success: true });
    } catch (error) {
      console.error("Error fetching city details:", error);
      return json({ error: "Failed to fetch city details" }, { status: 500 });
    }
  },
]);

// Get city statistics
citiesRouter.handle<CTXCookie>("GET /:cityId/stats", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["city_admin", "super_admin", "region_admin"] }),
  async (req, { params }) => {
    const cityId = params.cityId;
    const searchParams = new URL(req.url).searchParams;
    const academicYear = searchParams.get("academicYear") || undefined;

    try {
      const stats = await getCityStats(cityId, { academicYear });
      return json({ stats, success: true });
    } catch (error) {
      console.error("Error fetching city statistics:", error);
      return json(
        { error: "Failed to fetch city statistics" },
        { status: 500 },
      );
    }
  },
]);

// Create school in city
citiesRouter.handle<
  CTXCookie & { body: { name: string; code?: string; type?: string } }
>("POST /:cityId/schools", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["city_admin", "super_admin"] }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { params, body }) => {
    const cityId = params.cityId;
    const { name, code, type } = body;

    if (!name || name.trim().length === 0) {
      return json({ error: "School name is required" }, { status: 400 });
    }

    try {
      const school = await createSchool(cityId, name, code, type);
      return json({ school, success: true }, { status: 201 });
    } catch (error: any) {
      console.error("Error creating school:", error);
      if (error.message.includes("already exists")) {
        return json({ error: error.message }, { status: 400 });
      }
      if (error.message === "City not found") {
        return json({ error: "City not found" }, { status: 404 });
      }
      return json({ error: "Failed to create school" }, { status: 500 });
    }
  },
]);

// Get schools in city
citiesRouter.handle<CTXCookie>("GET /:cityId/schools", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["city_admin", "super_admin", "region_admin"] }),
  async (req, { params }) => {
    const cityId = params.cityId;
    const searchParams = new URL(req.url).searchParams;
    console.log(req.url);

    const options = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      search: searchParams.get("search") || undefined,
      withStats: searchParams.get("withStats") === "true",
      type: searchParams.get("type") || undefined,
    };

    try {
      const result = await getSchools(cityId, options);
      return json({ ...result, success: true });
    } catch (error) {
      console.error("Error fetching schools:", error);
      return json({ error: "Failed to fetch schools" }, { status: 500 });
    }
  },
]);

// Update school
citiesRouter.handle<
  CTXCookie & { body: { name?: string; code?: string; type?: string } }
>("PATCH /:cityId/schools/:schoolId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["city_admin", "super_admin"] }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { params, body }) => {
    const { cityId, schoolId } = params;

    if (Object.keys(body).length === 0) {
      return json({ error: "No updates provided" }, { status: 400 });
    }

    try {
      const school = await updateSchool(schoolId, body);
      return json({ school, success: true });
    } catch (error: any) {
      console.error("Error updating school:", error);
      if (error.message === "School not found") {
        return json({ error: "School not found" }, { status: 404 });
      }
      if (error.message.includes("already exists")) {
        return json({ error: error.message }, { status: 400 });
      }
      return json({ error: "Failed to update school" }, { status: 500 });
    }
  },
]);

// Delete school
citiesRouter.handle<CTXCookie>("DELETE /:cityId/schools/:schoolId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["city_admin", "super_admin"] }),
  async (req, { params }) => {
    const { cityId, schoolId } = params;

    try {
      await deleteSchool(schoolId);
      return json({
        success: true,
        message: "School deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting school:", error);
      if (error.message === "School not found") {
        return json({ error: "School not found" }, { status: 404 });
      }
      if (error.message.includes("Cannot delete")) {
        return json({ error: error.message }, { status: 400 });
      }
      return json({ error: "Failed to delete school" }, { status: 500 });
    }
  },
]);

// Get students in city
citiesRouter.handle<CTXCookie>("GET /:cityId/students", [
  parseCookie(),
  authenticate(),
  authorize({
    roles: ["city_admin", "super_admin", "region_admin", "school_admin"],
  }),
  async (req, { params }) => {
    const cityId = params.cityId;
    const searchParams = new URL(req.url).searchParams;
    console.log(req.url);

    const options = {
      schoolId: searchParams.get("schoolId") || undefined,
      academicYear: searchParams.get("academicYear") || undefined,
      isActive: searchParams.has("isActive")
        ? searchParams.get("isActive") === "true"
        : undefined,
      search: searchParams.get("search") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    };

    try {
      const result = await getStudents(cityId, options);
      return json({ ...result, success: true });
    } catch (error) {
      console.error("Error fetching students:", error);
      return json({ error: "Failed to fetch students" }, { status: 500 });
    }
  },
]);

// Get student submissions in city
citiesRouter.handle<CTXCookie>("GET /:cityId/submissions", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["city_admin", "super_admin", "region_admin"] }),
  async (req, { params }) => {
    const cityId = params.cityId;
    const searchParams = new URL(req.url).searchParams;
    console.log(req.url);

    const options = {
      schoolId: searchParams.get("schoolId") || undefined,
      academicYear: searchParams.get("academicYear") || undefined,
      status: searchParams.get("status") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    };

    try {
      const result = await getStudentSubmissions(cityId, options);
      return json({ ...result, success: true });
    } catch (error) {
      console.error("Error fetching student submissions:", error);
      return json(
        { error: "Failed to fetch student submissions" },
        { status: 500 },
      );
    }
  },
]);

// Get school details within city
citiesRouter.handle<CTXCookie>("GET /:cityId/schools/:schoolId", [
  parseCookie(),
  authenticate(),
  authorize({
    roles: ["city_admin", "super_admin", "region_admin", "school_admin"],
  }),
  async (req, { params }) => {
    const { cityId, schoolId } = params;

    try {
      // Get schools with stats for this specific school
      const result = await getSchools(cityId, {
        withStats: true,
        limit: 1,
      });

      const school = result.schools.find((s) => s.id === schoolId);
      if (!school) {
        return json(
          { error: "School not found in this city" },
          { status: 404 },
        );
      }

      return json({ school, success: true });
    } catch (error) {
      console.error("Error fetching school details:", error);
      return json({ error: "Failed to fetch school details" }, { status: 500 });
    }
  },
]);
