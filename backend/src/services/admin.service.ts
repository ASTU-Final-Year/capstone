// admin.service.ts
// admin.service.ts
import { and, eq, like, or, sql } from "drizzle-orm";
import { Admin, Role, User } from "../base";
import { db } from "../db";
import {
  admins,
  cities,
  regions,
  schools,
  universities,
  users,
} from "../db/schema";

// Existing functions...

// Get all admin users with filtering and pagination
export const getAllAdminUsers = async (options?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 20));
  const offset = (page - 1) * limit;
  const search = options?.search?.trim();
  const roleFilter = options?.role;

  try {
    // Build conditions for admin users (exclude super_admin and regular students)
    const conditions = [
      sql`${users.role} IN ('super_admin', 'region_admin', 'city_admin', 'school_admin', 'university_admin')`,
    ];

    if (search) {
      conditions.push(
        or(
          like(users.fullname, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.phone, `%${search}%`),
        ),
      );
    }

    // Get admin users with pagination
    const usersList = await db
      .select({
        user: users,
        admin: admins,
      })
      .from(users)
      .leftJoin(admins, eq(users.id, admins.userId))
      .where(and(...conditions))
      .orderBy(users.createdAt)
      .limit(limit)
      .offset(offset);

    // Apply role filter if specified
    let filteredUsers = usersList;
    if (roleFilter) {
      filteredUsers = usersList.filter((row) => row.user.role === roleFilter);
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(...conditions));

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    // Enrich user data with target info
    const enrichedUsers = await Promise.all(
      filteredUsers.map(async (row) => {
        const { user, admin } = row;
        let targetInfo = null;

        if (admin?.targetId) {
          switch (user.role) {
            case "region_admin":
              const [region] = await db
                .select()
                .from(regions)
                .where(eq(regions.id, admin.targetId))
                .limit(1);
              targetInfo = region;
              break;

            case "city_admin":
              const [city] = await db
                .select({
                  city: cities,
                  region: regions,
                })
                .from(cities)
                .innerJoin(regions, eq(cities.regionId, regions.id))
                .where(eq(cities.id, admin.targetId))
                .limit(1);
              targetInfo = city;
              break;

            case "school_admin":
              const [school] = await db
                .select({
                  school: schools,
                  city: cities,
                  region: regions,
                })
                .from(schools)
                .innerJoin(cities, eq(schools.cityId, cities.id))
                .innerJoin(regions, eq(cities.regionId, regions.id))
                .where(eq(schools.id, admin.targetId))
                .limit(1);
              targetInfo = school;
              break;

            case "university_admin":
              const [university] = await db
                .select({
                  university: universities,
                  region: regions,
                })
                .from(universities)
                .innerJoin(regions, eq(universities.regionId, regions.id))
                .where(eq(universities.id, admin.targetId))
                .limit(1);
              targetInfo = university;
              break;
          }
        }

        return {
          ...user,
          admin,
          targetInfo,
        };
      }),
    );

    return {
      users: enrichedUsers,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    throw new Error("Failed to fetch admin users");
  }
};

// Update admin user
export const updateAdminUser = async (
  userId: string,
  updates: Partial<{
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    isActive?: boolean;
  }>,
): Promise<User> => {
  // Transform field names to match your schema
  const dbUpdates: any = {};

  if (updates.firstName !== undefined || updates.lastName !== undefined) {
    // In your schema, you have fullname, not separate first/last name
    // You might need to adjust this based on your actual schema
    dbUpdates.fullname =
      `${updates.firstName || ""} ${updates.lastName || ""}`.trim();
  }

  if (updates.phoneNumber !== undefined) {
    dbUpdates.phone = updates.phoneNumber;
  }

  if (updates.isActive !== undefined) {
    dbUpdates.isActive = updates.isActive;
  }

  if (Object.keys(dbUpdates).length === 0) {
    throw new Error("No valid updates provided");
  }

  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...dbUpdates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error: any) {
    console.error("Error updating admin user:", error);
    throw new Error("Failed to update user");
  }
};

// Assign region to admin
export const assignRegionToAdmin = async (userId: string, regionId: string) => {
  try {
    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is a region admin
    if (user.role !== "region_admin") {
      throw new Error("User is not a region admin");
    }

    // Check if region exists
    const [region] = await db
      .select()
      .from(regions)
      .where(eq(regions.id, regionId))
      .limit(1);

    if (!region) {
      throw new Error("Region not found");
    }

    // Check if admin already has an admin record
    const existingAdmin = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, userId))
      .limit(1);

    let adminRecord;
    if (existingAdmin.length > 0) {
      // Update existing admin record
      [adminRecord] = await db
        .update(admins)
        .set({
          targetId: regionId,
        })
        .where(eq(admins.userId, userId))
        .returning();
    } else {
      // Create new admin record
      [adminRecord] = await db
        .insert(admins)
        .values({
          id: crypto.randomUUID(),
          userId,
          targetId: regionId,
        })
        .returning();
    }

    return adminRecord;
  } catch (error: any) {
    console.error("Error assigning region to admin:", error);
    if (
      error.message === "User not found" ||
      error.message === "Region not found" ||
      error.message === "User is not a region admin"
    ) {
      throw error;
    }
    throw new Error("Failed to assign region to admin");
  }
};

// Remove region from admin
export const removeRegionFromAdmin = async (
  userId: string,
  regionId: string,
) => {
  try {
    // Check if user exists and is a region admin
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if admin has a record for this region
    const existingAdmin = await db
      .select()
      .from(admins)
      .where(and(eq(admins.userId, userId), eq(admins.targetId, regionId)))
      .limit(1);

    if (existingAdmin.length === 0) {
      throw new Error("Region assignment not found");
    }

    // Remove the admin record (or just clear the targetId)
    const result = await db
      .delete(admins)
      .where(and(eq(admins.userId, userId), eq(admins.targetId, regionId)))
      .returning({ id: admins.id });

    if (result.length === 0) {
      throw new Error("Failed to remove region assignment");
    }

    return true;
  } catch (error: any) {
    console.error("Error removing region from admin:", error);
    if (
      error.message === "User not found" ||
      error.message === "Region assignment not found"
    ) {
      throw error;
    }
    throw new Error("Failed to remove region from admin");
  }
};

// Get user details
export const getUserDetails = async (userId: string) => {
  try {
    // Get user with admin info
    const [userData] = await db
      .select({
        user: users,
        admin: admins,
      })
      .from(users)
      .leftJoin(admins, eq(users.id, admins.userId))
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData) {
      return null;
    }

    // Get additional info based on role and target
    const { user, admin } = userData;

    let targetInfo = null;

    if (admin?.targetId) {
      switch (user.role) {
        case "region_admin":
          const [region] = await db
            .select()
            .from(regions)
            .where(eq(regions.id, admin.targetId))
            .limit(1);
          targetInfo = region;
          break;

        case "city_admin":
          const [city] = await db
            .select({
              city: cities,
              region: regions,
            })
            .from(cities)
            .innerJoin(regions, eq(cities.regionId, regions.id))
            .where(eq(cities.id, admin.targetId))
            .limit(1);
          targetInfo = city;
          break;

        case "school_admin":
          const [school] = await db
            .select({
              school: schools,
              city: cities,
              region: regions,
            })
            .from(schools)
            .innerJoin(cities, eq(schools.cityId, cities.id))
            .innerJoin(regions, eq(cities.regionId, regions.id))
            .where(eq(schools.id, admin.targetId))
            .limit(1);
          targetInfo = school;
          break;

        case "university_admin":
          const [university] = await db
            .select({
              university: universities,
              region: regions,
            })
            .from(universities)
            .innerJoin(regions, eq(universities.regionId, regions.id))
            .where(eq(universities.id, admin.targetId))
            .limit(1);
          targetInfo = university;
          break;
      }
    }

    return {
      ...user,
      admin,
      targetInfo,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
};

// Get admin by user ID
export const getAdminByUserId = async (
  userId: string,
): Promise<Admin | null> => {
  const result = await db
    .select()
    .from(admins)
    .where(eq(admins.userId, userId))
    .leftJoin(users, eq(admins.userId, users.id))
    .limit(1);

  if (result.length === 0) return null;

  const admin = result[0].admins;
  const user = result[0].users as User;

  return {
    ...admin,
    user,
  };
};

// Get admin by admin ID
export const getAdminById = async (adminId: string): Promise<Admin | null> => {
  const result = await db
    .select()
    .from(admins)
    .where(eq(admins.id, adminId))
    .leftJoin(users, eq(admins.userId, users.id))
    .limit(1);

  if (result.length === 0) return null;

  const admin = result[0].admins;
  const user = result[0].users as User;

  return {
    ...admin,
    user,
  };
};

// Check if user has admin role (now checks users.role instead of admins.role)
export const isUserAdmin = async (
  userId: string,
  role?: Role,
): Promise<boolean> => {
  const result = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (result.length === 0) return false;

  const userRole = result[0].role as Role;

  if (role) {
    return userRole === role;
  } else {
    // Check if user has any admin role
    const adminRoles: Role[] = [
      "super_admin",
      "region_admin",
      "city_admin",
      "school_admin",
      "university_admin",
    ];
    return adminRoles.includes(userRole);
  }
};

// Create a new admin
export const createAdmin = async (
  userId: string,
  targetId: string,
): Promise<Admin> => {
  const [admin] = await db
    .insert(admins)
    .values({
      id: crypto.randomUUID(),
      userId,
      targetId,
    })
    .returning();

  return admin;
};

// Delete admin
export const deleteAdmin = async (adminId: string): Promise<boolean> => {
  const result = await db.delete(admins).where(eq(admins.id, adminId));

  return result.rowCount > 0;
};

// Update admin target
export const updateAdmin = async (
  adminId: string,
  updates: Partial<Pick<Admin, "targetId">>,
): Promise<Admin | null> => {
  const [updated] = await db
    .update(admins)
    .set(updates)
    .where(eq(admins.id, adminId))
    .returning();

  return updated || null;
};

// Get all admins with optional filtering
export const getAllAdmins = async (filters?: {
  role?: Role;
  targetId?: string;
}): Promise<Admin[]> => {
  const conditions = [];

  if (filters?.targetId) {
    conditions.push(eq(admins.targetId, filters.targetId));
  }

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db
    .select()
    .from(admins)
    .where(query)
    .leftJoin(users, eq(admins.userId, users.id));

  // Filter by role if specified
  const filteredResults = filters?.role
    ? results.filter((row) => row.users?.role === filters.role)
    : results;

  return filteredResults.map((row) => ({
    ...row.admins,
    user: row.users as User,
  }));
};

// Get admin by role and target
export const getAdminByRoleAndTarget = async (
  role: Role,
  targetId: string,
): Promise<Admin | null> => {
  const results = await db
    .select()
    .from(admins)
    .where(eq(admins.targetId, targetId))
    .leftJoin(users, eq(admins.userId, users.id));

  const adminWithRole = results.find((row) => row.users?.role === role);

  if (!adminWithRole) return null;

  return {
    ...adminWithRole.admins,
    user: adminWithRole.users as User,
  };
};
