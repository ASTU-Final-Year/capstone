// region_admin.service.ts
import { and, eq, sql, desc, asc } from "drizzle-orm";
import { City, Region, School, University } from "../base";
import { db } from "../db";
import {
  cities,
  regions,
  schools,
  student_submissions,
  student_university_placements,
  students,
  universities,
} from "../db/schema";

// Types for better type safety
export interface RegionWithDetails extends Region {
  cities: City[];
  universities: University[];
  schools: School[];
  studentCount: number;
}

export interface RegionalStats {
  totalCities: number;
  totalUniversities: number;
  totalSchools: number;
  totalStudents: number;
  activeStudents: number;
  totalSubmissions: number;
  placementCount?: number;
}

export interface UniversityPlacement {
  placement: typeof student_university_placements.$inferSelect;
  student: typeof students.$inferSelect;
  university: typeof universities.$inferSelect;
  submission: typeof student_submissions.$inferSelect;
}

export interface CityWithStats extends City {
  schoolCount: number;
  studentCount: number;
}

// Utility function to validate UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Get region details by ID
export const getRegionDetails = async (
  regionId: string,
): Promise<RegionWithDetails | null> => {
  if (!isValidUUID(regionId)) {
    throw new Error("Invalid region ID format");
  }

  try {
    const region = await db
      .select()
      .from(regions)
      .where(eq(regions.id, regionId))
      .limit(1);

    if (region.length === 0) {
      return null;
    }

    // Fetch related data in parallel
    const [
      citiesResult,
      universitiesResult,
      schoolsResult,
      studentCountResult,
    ] = await Promise.all([
      db.select().from(cities).where(eq(cities.regionId, regionId)),
      db.select().from(universities).where(eq(universities.regionId, regionId)),
      db
        .select()
        .from(schools)
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .where(eq(cities.regionId, regionId))
        .then((results) => results.map((r) => r.schools)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(students)
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .where(eq(cities.regionId, regionId)),
    ]);

    return {
      ...region[0],
      cities: citiesResult,
      universities: universitiesResult,
      schools: schoolsResult,
      studentCount: studentCountResult[0]?.count || 0,
    };
  } catch (error) {
    console.error("Error fetching region details:", error);
    throw new Error("Failed to fetch region details");
  }
};

// Get region details by code
export const getRegionDetailsByCode = async (
  code: string,
): Promise<RegionWithDetails | null> => {
  if (!code || typeof code !== "string") {
    throw new Error("Region code is required");
  }

  try {
    // Use Drizzle's query builder instead of raw SQL to avoid column name issues
    const region = await db
      .select()
      .from(regions)
      .where(eq(regions.code, code))
      .limit(1);

    if (region.length === 0) {
      return null;
    }

    const regionId = region[0].id;

    // Fetch related data in parallel
    const [
      citiesResult,
      universitiesResult,
      schoolsResult,
      studentCountResult,
    ] = await Promise.all([
      db.select().from(cities).where(eq(cities.regionId, regionId)),
      db.select().from(universities).where(eq(universities.regionId, regionId)),
      db
        .select()
        .from(schools)
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .where(eq(cities.regionId, regionId))
        .then((results) => results.map((r) => r.schools)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(students)
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .where(eq(cities.regionId, regionId)),
    ]);

    return {
      ...region[0],
      cities: citiesResult,
      universities: universitiesResult,
      schools: schoolsResult,
      studentCount: studentCountResult[0]?.count || 0,
    };
  } catch (error) {
    console.error("Error fetching region details by code:", error);
    throw new Error("Failed to fetch region details");
  }
};

// Manage cities in region
export const createCity = async (
  regionId: string,
  name: string,
  longitude: number = 0,
  latitude: number = 0,
): Promise<City> => {
  // Validate inputs
  if (!isValidUUID(regionId)) {
    throw new Error("Invalid region ID format");
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new Error("City name is required and must be a non-empty string");
  }

  if (name.length > 100) {
    throw new Error("City name must be less than 100 characters");
  }

  // Validate coordinates if provided
  if (typeof longitude !== "number" || typeof latitude !== "number") {
    throw new Error("Longitude and latitude must be numbers");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90");
  }

  try {
    // Check if region exists
    const regionExists = await db
      .select({ id: regions.id })
      .from(regions)
      .where(eq(regions.id, regionId))
      .limit(1);

    if (regionExists.length === 0) {
      throw new Error("Region not found");
    }

    // Check for duplicate city name in the region
    const existingCity = await db
      .select({ id: cities.id })
      .from(cities)
      .where(and(eq(cities.regionId, regionId), eq(cities.name, name.trim())))
      .limit(1);

    if (existingCity.length > 0) {
      throw new Error("City with this name already exists in this region");
    }

    const [city] = await db
      .insert(cities)
      .values({
        id: crypto.randomUUID(),
        regionId,
        name: name.trim(),
        longitude,
        latitude,
        // createdAt: new Date(),
        // updatedAt: new Date(),
      })
      .returning();

    return city;
  } catch (error: any) {
    console.error("Error creating city:", error);
    if (
      error.message.includes("duplicate") ||
      error.message.includes("unique")
    ) {
      throw new Error("City name already exists in this region");
    }
    if (error.message.includes("Region not found")) {
      throw new Error("Region not found");
    }
    throw new Error("Failed to create city");
  }
};

// Update city
export const updateCity = async (
  cityId: string,
  updates: Partial<{
    name: string;
    longitude: number;
    latitude: number;
  }>,
): Promise<City> => {
  if (!isValidUUID(cityId)) {
    throw new Error("Invalid city ID format");
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No updates provided");
  }

  // Validate name if provided
  if (updates.name !== undefined) {
    if (typeof updates.name !== "string" || updates.name.trim().length === 0) {
      throw new Error("City name must be a non-empty string");
    }
    if (updates.name.length > 100) {
      throw new Error("City name must be less than 100 characters");
    }
    updates.name = updates.name.trim();
  }

  // Validate coordinates if provided
  if (updates.longitude !== undefined) {
    if (
      typeof updates.longitude !== "number" ||
      updates.longitude < -180 ||
      updates.longitude > 180
    ) {
      throw new Error("Longitude must be between -180 and 180");
    }
  }

  if (updates.latitude !== undefined) {
    if (
      typeof updates.latitude !== "number" ||
      updates.latitude < -90 ||
      updates.latitude > 90
    ) {
      throw new Error("Latitude must be between -90 and 90");
    }
  }

  try {
    const [updatedCity] = await db
      .update(cities)
      .set({
        ...updates,
        // updatedAt: new Date(),
      })
      .where(eq(cities.id, cityId))
      .returning();

    if (!updatedCity) {
      throw new Error("City not found");
    }

    return updatedCity;
  } catch (error: any) {
    console.error("Error updating city:", error);
    if (
      error.message.includes("duplicate") ||
      error.message.includes("unique")
    ) {
      throw new Error("City name already exists in this region");
    }
    throw new Error("Failed to update city");
  }
};

// Delete city
export const deleteCity = async (cityId: string): Promise<boolean> => {
  if (!isValidUUID(cityId)) {
    throw new Error("Invalid city ID format");
  }

  try {
    // Check if city has any schools
    const schoolsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(schools)
      .where(eq(schools.cityId, cityId));

    if (schoolsCount[0].count > 0) {
      throw new Error(
        "Cannot delete city that has schools. Delete schools first.",
      );
    }

    const result = await db
      .delete(cities)
      .where(eq(cities.id, cityId))
      .returning({ id: cities.id });

    return result.length > 0;
  } catch (error: any) {
    console.error("Error deleting city:", error);
    if (error.message.includes("Cannot delete")) {
      throw error;
    }
    throw new Error("Failed to delete city");
  }
};

// Get cities in region with optional filtering and pagination
export const getCities = async (
  regionId: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
    withStats?: boolean;
  },
): Promise<{
  cities: City[] | CityWithStats[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  if (!isValidUUID(regionId)) {
    throw new Error("Invalid region ID format");
  }

  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 20));
  const offset = (page - 1) * limit;
  const search = options?.search?.trim();
  const withStats = options?.withStats || false;

  try {
    // Base conditions
    const conditions = [eq(cities.regionId, regionId)];

    if (search) {
      conditions.push(sql`LOWER(${cities.name}) LIKE LOWER(${`%${search}%`})`);
    }

    if (withStats) {
      const citiesWithStats = await db
        .select({
          city: cities,
          schoolCount: sql<number>`COUNT(DISTINCT schools.id)`,
          studentCount: sql<number>`COUNT(DISTINCT students.id)`,
        })
        .from(cities)
        .leftJoin(schools, eq(cities.id, schools.cityId))
        .leftJoin(students, eq(schools.id, students.schoolId))
        .where(and(...conditions))
        .groupBy(cities.id)
        .orderBy(asc(cities.name))
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      const totalResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${cities.id})` })
        .from(cities)
        .where(and(...conditions));

      const total = totalResult[0].count;
      const totalPages = Math.ceil(total / limit);

      return {
        cities: citiesWithStats.map((row) => ({
          ...row.city,
          schoolCount: row.schoolCount,
          studentCount: row.studentCount,
        })),
        total,
        page,
        totalPages,
      };
    } else {
      const citiesList = await db
        .select()
        .from(cities)
        .where(and(...conditions))
        .orderBy(asc(cities.name))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(cities)
        .where(and(...conditions));

      const total = totalResult[0].count;
      const totalPages = Math.ceil(total / limit);

      return {
        cities: citiesList,
        total,
        page,
        totalPages,
      };
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw new Error("Failed to fetch cities");
  }
};

// Get schools in region with optional city filtering
export const getSchools = async (
  regionId: string,
  options?: {
    cityId?: string;
    page?: number;
    limit?: number;
    search?: string;
  },
): Promise<{
  schools: (typeof schools.$inferSelect & {
    city: typeof cities.$inferSelect;
  })[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  if (!isValidUUID(regionId)) {
    throw new Error("Invalid region ID format");
  }

  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 20));
  const offset = (page - 1) * limit;
  const search = options?.search?.trim();
  const cityId = options?.cityId;

  try {
    // Base conditions
    const conditions = [eq(cities.regionId, regionId)];

    if (cityId) {
      if (!isValidUUID(cityId)) {
        throw new Error("Invalid city ID format");
      }
      conditions.push(eq(schools.cityId, cityId));
    }

    if (search) {
      conditions.push(sql`LOWER(${schools.name}) LIKE LOWER(${`%${search}%`})`);
    }

    const schoolsList = await db
      .select({
        school: schools,
        city: cities,
      })
      .from(schools)
      .innerJoin(cities, eq(schools.cityId, cities.id))
      .where(and(...conditions))
      .orderBy(asc(schools.name))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schools)
      .innerJoin(cities, eq(schools.cityId, cities.id))
      .where(and(...conditions));

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    return {
      schools: schoolsList.map((sl) => ({ ...sl.school, city: sl.city })),
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw new Error("Failed to fetch schools");
  }
};

// Get regional university placements with filtering
export const getUniversityPlacements = async (
  regionId: string,
  options?: {
    academicYear?: string;
    universityId?: string;
    page?: number;
    limit?: number;
  },
): Promise<{
  placements: UniversityPlacement[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  if (!isValidUUID(regionId)) {
    throw new Error("Invalid region ID format");
  }

  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 20));
  const offset = (page - 1) * limit;
  const academicYear = options?.academicYear;
  const universityId = options?.universityId;

  try {
    const conditions = [eq(cities.regionId, regionId)];

    if (academicYear) {
      conditions.push(eq(student_submissions.academicYear, academicYear));
    }

    if (universityId) {
      if (!isValidUUID(universityId)) {
        throw new Error("Invalid university ID format");
      }
      conditions.push(eq(universities.id, universityId));
    }

    const placements = await db
      .select({
        placement: student_university_placements,
        student: students,
        university: universities,
        submission: student_submissions,
      })
      .from(student_university_placements)
      .innerJoin(
        students,
        eq(student_university_placements.studentId, students.id),
      )
      .innerJoin(
        universities,
        eq(student_university_placements.unniversityId, universities.id),
      )
      .innerJoin(
        student_submissions,
        eq(
          student_university_placements.studentId,
          student_submissions.studentId,
        ),
      )
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .innerJoin(cities, eq(schools.cityId, cities.id))
      .where(and(...conditions))
      .orderBy(desc(student_university_placements.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(student_university_placements)
      .innerJoin(
        students,
        eq(student_university_placements.studentId, students.id),
      )
      .innerJoin(
        universities,
        eq(student_university_placements.unniversityId, universities.id),
      )
      .innerJoin(
        student_submissions,
        eq(
          student_university_placements.studentId,
          student_submissions.studentId,
        ),
      )
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .innerJoin(cities, eq(schools.cityId, cities.id))
      .where(and(...conditions));

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    return {
      placements,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching university placements:", error);
    throw new Error("Failed to fetch university placements");
  }
};

// Get regional statistics
export const getRegionalStats = async (
  regionId: string,
): Promise<RegionalStats> => {
  if (!isValidUUID(regionId)) {
    throw new Error("Invalid region ID format");
  }

  try {
    const [
      citiesCount,
      universitiesCount,
      schoolsCount,
      studentsCount,
      activeStudentsCount,
      submissionsCount,
      placementsCount,
    ] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(cities)
        .where(eq(cities.regionId, regionId)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(universities)
        .where(eq(universities.regionId, regionId)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(schools)
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .where(eq(cities.regionId, regionId)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(students)
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .where(eq(cities.regionId, regionId)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(students)
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .where(and(eq(cities.regionId, regionId), eq(students.isActive, true))),
      db
        .select({ count: sql<number>`count(*)` })
        .from(student_submissions)
        .innerJoin(students, eq(student_submissions.studentId, students.id))
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .where(eq(cities.regionId, regionId)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(student_university_placements)
        .innerJoin(
          students,
          eq(student_university_placements.studentId, students.id),
        )
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .where(eq(cities.regionId, regionId)),
    ]);

    return {
      totalCities: citiesCount[0].count,
      totalUniversities: universitiesCount[0].count,
      totalSchools: schoolsCount[0].count,
      totalStudents: studentsCount[0].count,
      activeStudents: activeStudentsCount[0].count,
      totalSubmissions: submissionsCount[0].count,
      placementCount: placementsCount[0].count,
    };
  } catch (error) {
    console.error("Error fetching regional statistics:", error);
    throw new Error("Failed to fetch regional statistics");
  }
};
