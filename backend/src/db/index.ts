import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  createAdminUser,
  deleteUser,
  getUserByEmail,
} from "../services/user.service";
import { getRegionDetailsByCode } from "../services/region_admin.service";
import { createRegion } from "../services/super_admin.service";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool });

// create super-admin account
export const populate = async () => {
  getUserByEmail("super.admin@localhost.dev").then(async (user) => {
    if (user) {
      await deleteUser(user.id);
    }
  });
  getUserByEmail("super.admin@choicex.gov.et").then((user) => {
    if (!user) {
      createAdminUser(
        {
          email: "super.admin@choicex.gov.et",
          fullname: "Super Admin",
          gender: "U",
          password: "SuperAdmin@12345",
          phone: "",
        },
        {
          targetId: crypto.randomUUID(),
          role: "super_admin",
        },
      );
    }
  });

  getRegionDetailsByCode("AA").then((region) => {
    if (!region) {
      createRegion("Addis Abeba", "AA").then((region) => {
        getUserByEmail("addis.abeba.region@choicex.gov.et").then((user) => {
          if (!user) {
            createAdminUser(
              {
                email: "addis.abeba.region@choicex.gov.et",
                fullname: "Addis Abeba Region Admin",
                gender: "U",
                password: "AddisAbebaRegionAdmin@12345",
                phone: "",
              },
              {
                targetId: region.id,
                role: "region_admin",
              },
            );
          }
        });
      });
    }
  });
};
