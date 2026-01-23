import { eq, sql } from "drizzle-orm";
import { Admin, Region, Role, User } from "../base";
import { db } from "../db";
import {
  admins,
  regions,
  schools,
  student_submissions,
  students,
  universities,
  users,
} from "../db/schema";
import { createAdmin, deleteAdmin } from "./admin.service";

// Get all users in the system
export const getAllUsers = async (): Promise<User[]> => {
  const userResults = await db.select().from(users).orderBy(users.createdAt);

  return userResults as User[];
};

// Get system statistics
export const getSystemStats = async (): Promise<{
  totalUsers: number;
  totalStudents: number;
  totalAdmins: number;
  totalUniversities: number;
  totalSchools: number;
  totalSubmissions: number;
}> => {
  const [
    usersCount,
    studentsCount,
    adminsCount,
    universitiesCount,
    schoolsCount,
    submissionsCount,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(students),
    db.select({ count: sql<number>`count(*)` }).from(admins),
    db.select({ count: sql<number>`count(*)` }).from(universities),
    db.select({ count: sql<number>`count(*)` }).from(schools),
    db.select({ count: sql<number>`count(*)` }).from(student_submissions),
  ]);

  return {
    totalUsers: usersCount[0].count,
    totalStudents: studentsCount[0].count,
    totalAdmins: adminsCount[0].count,
    totalUniversities: universitiesCount[0].count,
    totalSchools: schoolsCount[0].count,
    totalSubmissions: submissionsCount[0].count,
  };
};

// Manage other admins
export const promoteToAdmin = async (
  userId: string,
  role: Role,
  targetId: string,
): Promise<Admin> => {
  return await createAdmin(userId, role, targetId);
};

// Remove admin privileges
export const demoteAdmin = async (adminId: string): Promise<boolean> => {
  return await deleteAdmin(adminId);
};

// Manage regions
export const createRegion = async (
  name: string,
  code?: string,
): Promise<Region> => {
  const [region] = await db
    .insert(regions)
    .values({ id: crypto.randomUUID(), name, code })
    .returning();

  return region;
};

export const updateRegion = async (
  regionId: string,
  updates: Partial<Pick<Region, "name" | "code">>,
): Promise<Region | null> => {
  const [updated] = await db
    .update(regions)
    .set(updates)
    .where(eq(regions.id, regionId))
    .returning();

  return updated || null;
};

export const deleteRegion = async (regionId: string): Promise<boolean> => {
  const result = await db.delete(regions).where(eq(regions.id, regionId));

  return result.rowCount > 0;
};
