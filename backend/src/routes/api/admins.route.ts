// routes/api/admin.route.ts
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
  getAllAdminUsers,
  updateAdminUser,
  assignRegionToAdmin,
  removeRegionFromAdmin,
  getUserDetails,
} from "../../services/admin.service";
import {
  getAdminsByRoleAndTarget,
  getAllAdminsByRole,
} from "../../services/super_admin.service";

export const adminsRouter = new Router<CTXMain>();

// Get all admins by role
adminsRouter.handle<CTXCookie>("GET /:role", [
  parseCookie(),
  authenticate(),
  authorize({
    roles: ["super_admin", "region_admin", "city_admin", "school_admin"],
  }),
  async (req, { params }) => {
    const role = params.role;
    const validRoles = [
      "region_admin",
      "city_admin",
      "school_admin",
      "university_admin",
    ];

    if (!validRoles.includes(role)) {
      return json({ error: "Invalid admin role" }, { status: 400 });
    }

    try {
      const admins = await getAllAdminsByRole(role as any);
      return json({ admins, success: true });
    } catch (error) {
      return json({ error: "Failed to fetch admins" }, { status: 500 });
    }
  },
]);

adminsRouter.handle<CTXCookie>("GET /user/:userId", [
  parseCookie(),
  authenticate(),
  authorize({
    roles: ["super_admin", "region_admin", "city_admin", "school_admin"],
  }),
  async (req, { params }) => {
    const userId = params.userId;

    try {
      // Get user details
      const userDetails = await getUserDetails(userId);
      if (!userDetails) {
        return json({ error: "User not found" }, { status: 404 });
      }

      return json({ user: userDetails, success: true });
    } catch (error) {
      console.error("Error fetching user details:", error);
      return json({ error: "Failed to fetch user details" }, { status: 500 });
    }
  },
]);

// NEW: Get admins by role and target ID
adminsRouter.handle<CTXCookie>("GET /:role/:targetId", [
  parseCookie(),
  authenticate(),
  authorize({
    roles: ["super_admin", "region_admin", "city_admin", "school_admin"],
  }),
  async (req, { params }) => {
    const { role, targetId } = params;
    const validRoles = [
      "region_admin",
      "city_admin",
      "school_admin",
      "university_admin",
    ];

    if (!validRoles.includes(role)) {
      return json({ error: "Invalid admin role" }, { status: 400 });
    }

    if (!targetId) {
      return json({ error: "Target ID is required" }, { status: 400 });
    }

    try {
      const admins = await getAdminsByRoleAndTarget(role as any, targetId);
      return json({ admins, success: true });
    } catch (error) {
      console.error("Error fetching admins by role and target:", error);
      return json({ error: "Failed to fetch admins" }, { status: 500 });
    }
  },
]);

// Get all admin users with filtering
adminsRouter.handle<CTXCookie>("GET /users", [
  parseCookie(),
  authenticate(),
  authorize({
    roles: ["super_admin", "region_admin", "city_admin", "school_admin"],
  }),
  async (req, ctx) => {
    try {
      const searchParams = new URL(req.url).searchParams;
      const options = {
        role: searchParams.get("role") || undefined,
        search: searchParams.get("search") || undefined,
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "20"),
        isActive: searchParams.has("isActive")
          ? searchParams.get("isActive") === "true"
          : undefined,
      };

      const result = await getAllAdminUsers(options);
      return json({ ...result, success: true });
    } catch (error) {
      console.error("Error fetching admin users:", error);
      return json({ error: "Failed to fetch admin users" }, { status: 500 });
    }
  },
]);

// Update admin user
adminsRouter.handle<
  CTXCookie & {
    body: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      isActive?: boolean;
    };
  }
>("PATCH /user/:userId", [
  parseCookie(),
  authenticate(),
  authorize({
    roles: ["super_admin", "region_admin", "city_admin", "school_admin"],
  }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { params, body }) => {
    const userId = params.userId;

    try {
      const updatedUser = await updateAdminUser(userId, body);
      return json({ user: updatedUser, success: true });
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error.message === "User not found") {
        return json({ error: "User not found" }, { status: 404 });
      }
      return json({ error: "Failed to update user" }, { status: 500 });
    }
  },
]);

// Assign region to admin
adminsRouter.handle<CTXCookie & { body: { regionId: string } }>(
  "POST /user/:userId/regions",
  [
    parseCookie(),
    authenticate(),
    authorize({
      roles: ["super_admin", "region_admin", "city_admin", "school_admin"],
    }),
    parseBody({
      accept: ["application/json"],
      maxSize: 1024,
    }),
    async (req, { params, body }) => {
      const userId = params.userId;
      const { regionId } = body;

      if (!regionId) {
        return json({ error: "Region ID is required" }, { status: 400 });
      }

      try {
        const assignment = await assignRegionToAdmin(userId, regionId);
        return json({ assignment, success: true }, { status: 201 });
      } catch (error: any) {
        console.error("Error assigning region to admin:", error);
        if (error.message === "User not found") {
          return json({ error: "User not found" }, { status: 404 });
        }
        if (error.message === "Region not found") {
          return json({ error: "Region not found" }, { status: 404 });
        }
        if (error.message === "User is not a region admin") {
          return json({ error: "User is not a region admin" }, { status: 400 });
        }
        if (error.message === "Region already assigned to this admin") {
          return json(
            { error: "Region already assigned to this admin" },
            { status: 400 },
          );
        }
        return json(
          { error: "Failed to assign region to admin" },
          { status: 500 },
        );
      }
    },
  ],
);

// Remove region from admin
adminsRouter.handle<CTXCookie>("DELETE /user/:userId/regions/:regionId", [
  parseCookie(),
  authenticate(),
  authorize({
    roles: ["super_admin", "region_admin", "city_admin", "school_admin"],
  }),
  async (req, { params }) => {
    const { userId, regionId } = params;

    try {
      await removeRegionFromAdmin(userId, regionId);
      return json({ success: true, message: "Region removed from admin" });
    } catch (error: any) {
      console.error("Error removing region from admin:", error);
      if (error.message === "Region assignment not found") {
        return json({ error: "Region assignment not found" }, { status: 404 });
      }
      return json(
        { error: "Failed to remove region from admin" },
        { status: 500 },
      );
    }
  },
]);
