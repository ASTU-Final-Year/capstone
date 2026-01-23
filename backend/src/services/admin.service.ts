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

// Check if user is admin of specific type
export const isUserAdmin = async (
  userId: string,
  role?: Role,
): Promise<boolean> => {
  if (role) {
    const result = await db
      .select()
      .from(admins)
      .where(and(eq(admins.userId, userId), eq(admins.role, role)))
      .limit(1);
    return result.length > 0;
  } else {
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, userId))
      .limit(1);
    return result.length > 0;
  }
};

// Create a new admin
export const createAdmin = async (
  userId: string,
  role: Role,
  targetId: string,
): Promise<Admin> => {
  const [admin] = await db
    .insert(admins)
    .values({
      id: crypto.randomUUID(),
      userId,
      role,
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

// Update admin role or target
export const updateAdmin = async (
  adminId: string,
  updates: Partial<Pick<Admin, "role" | "targetId">>,
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

  if (filters?.role) {
    conditions.push(eq(admins.role, filters.role));
  }

  if (filters?.targetId) {
    conditions.push(eq(admins.targetId, filters.targetId));
  }

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db
    .select()
    .from(admins)
    .where(query)
    .leftJoin(users, eq(admins.userId, users.id));

  return results.map((row) => ({
    ...row.admins,
    user: row.users as User,
  }));
};
