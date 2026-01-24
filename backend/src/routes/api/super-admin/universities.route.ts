import {
  Router,
  parseBody,
  parseCookie,
  json,
  CTXCookie,
} from "@bepalo/router";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { CTXMain, University } from "../../../base";
import {
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getAllUniversities,
  getUniversityById,
} from "../../../services/super_admin.service";

export const universitiesRouter = new Router<CTXMain>();

// Get all universities
universitiesRouter.handle<CTXCookie>("GET /", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  async () => {
    try {
      const universities = await getAllUniversities();
      return json({ universities, success: true });
    } catch (error) {
      return json({ error: "Failed to fetch universities" }, { status: 500 });
    }
  },
]);

// Get university by ID
universitiesRouter.handle<CTXCookie>("GET /:universityId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  async (req, { params }) => {
    const universityId = params.universityId;
    try {
      const university = await getUniversityById(universityId);
      if (!university) {
        return json({ error: "University not found" }, { status: 404 });
      }
      return json({ university, success: true });
    } catch (error) {
      return json({ error: "Failed to fetch university" }, { status: 500 });
    }
  },
]);

// Create university
universitiesRouter.handle<
  CTXCookie & {
    body: Omit<University, "id">;
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
    const {
      name,
      abbreviation,
      regionId,
      longitude,
      latitude,
      capacity,
      website,
      contactEmail,
      contactPhone,
    } = body;

    if (!name || !abbreviation || !regionId || !capacity) {
      return json({ error: "Required fields missing" }, { status: 400 });
    }

    try {
      const university = await createUniversity({
        name,
        abbreviation,
        regionId,
        longitude: longitude || 0,
        latitude: latitude || 0,
        capacity: capacity,
        website,
        contactEmail,
        contactPhone,
      });
      return json({ university, success: true }, { status: 201 });
    } catch (error: any) {
      if (error.message?.includes("unique constraint")) {
        return json(
          { error: "University name or abbreviation already exists" },
          { status: 400 },
        );
      }
      return json({ error: "Failed to create university" }, { status: 500 });
    }
  },
]);

// Update university
universitiesRouter.handle<
  CTXCookie & {
    body: Omit<University, "id">;
  }
>("PUT /:universityId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  parseBody({
    accept: ["application/json", "application/x-www-form-urlencoded"],
    maxSize: 1024,
  }),
  async (req, { params, body }) => {
    const universityId = params.universityId;
    const updates = body;

    try {
      const university = await updateUniversity(universityId, updates);
      if (!university) {
        return json({ error: "University not found" }, { status: 404 });
      }
      return json({ university, success: true });
    } catch (error: any) {
      if (error.message?.includes("unique constraint")) {
        return json(
          { error: "University name or abbreviation already exists" },
          { status: 400 },
        );
      }
      return json({ error: "Failed to update university" }, { status: 500 });
    }
  },
]);

// Delete university
universitiesRouter.handle<CTXCookie>("DELETE /:universityId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  async (req, { params }) => {
    const universityId = params.universityId;

    try {
      const deleted = await deleteUniversity(universityId);
      if (!deleted) {
        return json({ error: "University not found" }, { status: 404 });
      }
      return json({
        success: true,
        message: "University deleted successfully",
      });
    } catch (error: any) {
      if (error.message?.includes("foreign key constraint")) {
        return json(
          { error: "Cannot delete university with associated data" },
          { status: 400 },
        );
      }
      return json({ error: "Failed to delete university" }, { status: 500 });
    }
  },
]);
