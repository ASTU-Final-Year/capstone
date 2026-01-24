import {
  Router,
  parseBody,
  parseCookie,
  json,
  CTXCookie,
  CTXBody,
} from "@bepalo/router";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { CTXMain, Role } from "../../../base";
import {
  createAdminWithRole,
  getAllAdminsByRole,
  demoteAdmin,
  getAllRegions,
  getAllUniversities,
} from "../../../services/super_admin.service";

export const adminsRouter = new Router<CTXMain>();

interface CreateAdminBody {
  role: Role;
  targetId: string;
  fullname: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
}

// Get all admins by role
adminsRouter.handle<CTXCookie>("GET /:role", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
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

// Create admin
adminsRouter.handle<CTXCookie & CTXBody & { body: CreateAdminBody }>("POST /", [
  parseCookie(),
  authenticate(),
  authorize({
    roles: ["region_admin", "city_admin", "school_admin", "university_admin"],
  }),
  parseBody({
    accept: ["application/json", "application/x-www-form-urlencoded"],
    maxSize: 1024,
  }),
  async (req, { body }) => {
    const { role, targetId, fullname, email, password, gender, phone } = body;

    if (
      !role ||
      !targetId ||
      !fullname ||
      !email ||
      !password ||
      !gender ||
      !phone
    ) {
      return json({ error: "All fields are required" }, { status: 400 });
    }

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
      const { user, admin } = await createAdminWithRole(
        { fullname, email, password, gender, phone },
        role,
        targetId,
      );
      return json({ user, admin, success: true }, { status: 201 });
    } catch (error: any) {
      if (error.message?.includes("unique constraint")) {
        return json({ error: "Email already exists" }, { status: 400 });
      }
      return json({ error: "Failed to create admin" }, { status: 500 });
    }
  },
]);

// Demote admin
adminsRouter.handle<CTXCookie & { body: { userId: string } }>(
  "DELETE /:adminId",
  [
    parseCookie(),
    authenticate(),
    authorize({ roles: ["super_admin"] }),
    parseBody({
      accept: ["application/json", "application/x-www-form-urlencoded"],
      maxSize: 1024,
    }),
    async (req, { params, body }) => {
      const adminId = params.adminId;
      const { userId } = body;

      if (!userId) {
        return json({ error: "User ID is required" }, { status: 400 });
      }

      try {
        const deleted = await demoteAdmin(adminId, userId);
        if (!deleted) {
          return json({ error: "Admin not found" }, { status: 404 });
        }
        return json({
          success: true,
          message: "Admin demoted successfully",
        });
      } catch (error) {
        return json({ error: "Failed to demote admin" }, { status: 500 });
      }
    },
  ],
);

// Get available targets for admin creation
adminsRouter.handle<CTXCookie>("GET /targets/:role", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  async (req, { params }) => {
    const role = params.role;

    try {
      let targets = [];
      switch (role) {
        case "region_admin":
          targets = await getAllRegions();
          break;
        case "university_admin":
          targets = await getAllUniversities();
          break;
        default:
          targets = [];
      }
      return json({ targets, success: true });
    } catch (error) {
      return json({ error: "Failed to fetch targets" }, { status: 500 });
    }
  },
]);
