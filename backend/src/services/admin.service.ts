// admin.service.ts
import { and, eq } from "drizzle-orm";
import { Admin, Role, User } from "../base";
import { db } from "../db";
import { admins, users } from "../db/schema";

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
