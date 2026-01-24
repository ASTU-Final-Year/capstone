import { eq, sql } from "drizzle-orm";
import { Admin, Region, Role, University, User } from "../base";
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
import { createUser } from "./user.service";

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
    totalUsers: usersCount[0]?.count || 0,
    totalStudents: studentsCount[0]?.count || 0,
    totalAdmins: adminsCount[0]?.count || 0,
    totalUniversities: universitiesCount[0]?.count || 0,
    totalSchools: schoolsCount[0]?.count || 0,
    totalSubmissions: submissionsCount[0]?.count || 0,
  };
};

// Manage other admins
export const promoteToAdmin = async (
  userId: string,
  role: Role,
  targetId: string,
): Promise<Admin> => {
  return await createAdmin(userId, targetId);
};

// Remove admin privileges
export const demoteAdmin = async (
  adminId: string,
  userId: string,
): Promise<boolean> => {
  // Delete admin record
  const adminDeleted = await deleteAdmin(adminId);

  if (adminDeleted) {
    // Reset user role to student
    await db
      .update(users)
      .set({
        role: "student",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  return adminDeleted;
};

// Manage regions
export const createRegion = async (
  name: string,
  code?: string,
): Promise<Region> => {
  const [region] = await db
    .insert(regions)
    .values({
      id: crypto.randomUUID(),
      name,
      code,
    })
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

// Get all regions
export const getAllRegions = async (): Promise<Region[]> => {
  const regionsList = await db.select().from(regions).orderBy(regions.name);
  return regionsList;
};

// Get region by ID
export const getRegionById = async (
  regionId: string,
): Promise<Region | null> => {
  const [region] = await db
    .select()
    .from(regions)
    .where(eq(regions.id, regionId))
    .limit(1);
  return region || null;
};

// Get all universities
export const getAllUniversities = async (): Promise<University[]> => {
  const universitiesList = await db
    .select()
    .from(universities)
    .orderBy(universities.name);
  return universitiesList;
};

// Get university by ID
export const getUniversityById = async (
  universityId: string,
): Promise<University | null> => {
  const [university] = await db
    .select()
    .from(universities)
    .where(eq(universities.id, universityId))
    .limit(1);
  return university || null;
};

// Create university
export const createUniversity = async (data: {
  name: string;
  abbreviation: string;
  regionId: string;
  longitude: number;
  latitude: number;
  capacity: number;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
}): Promise<University> => {
  const [university] = await db
    .insert(universities)
    .values({
      id: crypto.randomUUID(),
      name: data.name,
      abbreviation: data.abbreviation,
      regionId: data.regionId,
      longitude: data.longitude,
      latitude: data.latitude,
      capacity: data.capacity,
      website: data.website,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      isActive: true,
    })
    .returning();

  return university;
};

// Update university
export const updateUniversity = async (
  universityId: string,
  updates: Partial<Omit<University, "id" | "region" | "placements">>,
): Promise<University | null> => {
  const [updated] = await db
    .update(universities)
    .set(updates)
    .where(eq(universities.id, universityId))
    .returning();

  return updated || null;
};

// Delete university
export const deleteUniversity = async (
  universityId: string,
): Promise<boolean> => {
  const result = await db
    .delete(universities)
    .where(eq(universities.id, universityId));
  return result.rowCount > 0;
};

// Create admin with role
export const createAdminWithRole = async (
  userData: {
    fullname: string;
    email: string;
    password: string;
    gender: string;
    phone: string;
  },
  role: Role,
  targetId: string,
): Promise<{ user: User; admin: Admin }> => {
  // Create user with admin role
  const user = await createUser({
    ...userData,
    role,
  });

  // Create admin record
  const admin = await createAdmin(user.id, targetId);

  return { user, admin };
};

// Get all admins by role
export const getAllAdminsByRole = async (
  role: Role,
): Promise<(Admin & { user: User; target?: any })[]> => {
  const results = await db
    .select()
    .from(admins)
    .innerJoin(users, eq(admins.userId, users.id))
    .where(eq(users.role, role));

  // Fetch target details based on role
  const adminsWithDetails = await Promise.all(
    results.map(async (row) => {
      let target = null;
      if (role === "region_admin") {
        const [region] = await db
          .select()
          .from(regions)
          .where(eq(regions.id, row.admins.targetId))
          .limit(1);
        target = region;
      } else if (role === "university_admin") {
        const [university] = await db
          .select()
          .from(universities)
          .where(eq(universities.id, row.admins.targetId))
          .limit(1);
        target = university;
      }

      return {
        ...row.admins,
        user: row.users as User,
        target,
      };
    }),
  );

  return adminsWithDetails;
};
