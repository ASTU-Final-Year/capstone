import { Router, parseCookie, json, CTXCookie } from "@bepalo/router";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { CTXMain } from "../../../base";
import { getSystemStats } from "../../../services/super_admin.service";

export const statsRouter = new Router<CTXMain>();

// Get system statistics
statsRouter.handle<CTXCookie>("GET /", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["super_admin"] }),
  async () => {
    try {
      const stats = await getSystemStats();
      return json({ stats, success: true });
    } catch (error) {
      return json(
        { error: "Failed to fetch system statistics" },
        { status: 500 },
      );
    }
  },
]);
