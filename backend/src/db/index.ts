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
import { config, dbConfig } from "../config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool });

// create super-admin account
export const populateDb = async () => {
  // await getUserByEmail("super.admin@localhost.dev").then(async (user) => {
  //   if (user) {
  //     await deleteUser(user.id);
  //   }
  // });

  const superAdminEmail =
    Bun.env.SUPER_ADMIN_EMAIL || "super.admin@" + config.emailDomain;
  await getUserByEmail(superAdminEmail).then((user) => {
    if (!user) {
      console.log("POPULATE_DB: creating super-admin...");
      createAdminUser(
        {
          email: superAdminEmail,
          fullname: Bun.env.SUPER_ADMIN_FULLNAME || "Super Admin",
          password: Bun.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@12345",
          gender: "U",
          phone: "",
          role: "super_admin",
        },
        {
          targetId: crypto.randomUUID(),
        },
      );
    }
    console.log("POPULATE_DB: super-admin already created.");
  });

  await getRegionDetailsByCode("AA").then((region) => {
    if (!region) {
      createRegion("Addis Abeba", "AA").then((region) => {
        getUserByEmail("addis.abeba.region@" + config.emailDomain).then(
          (user) => {
            if (!user) {
              createAdminUser(
                {
                  email: "addis.abeba.region@" + config.emailDomain,
                  fullname: "Addis Abeba Region Admin",
                  gender: "U",
                  password: "AddisAbebaRegionAdmin@12345",
                  phone: "",
                  role: "region_admin",
                },
                {
                  targetId: region.id,
                },
              );
            }
          },
        );
      });
    }
  });
};
