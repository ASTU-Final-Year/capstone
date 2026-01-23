import { and, eq, sql } from "drizzle-orm";
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

export const getRegionDetails = async (
  regionId: string,
): Promise<
  Region & {
    cities: City[];
    universities: University[];
    schools: School[];
    studentCount: number;
  }
> => {
  const region = await db
    .select()
    .from(regions)
    .where(eq(regions.id, regionId))
    .limit(1);

  if (region.length === 0) {
    return null;
  }

  const [citiesResult, universitiesResult, schoolsResult, studentCountResult] =
    await Promise.all([
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
};

export const getRegionDetailsByCode = async (
  code: string,
): Promise<
  Region & {
    cities: City[];
    universities: University[];
    schools: School[];
    studentCount: number;
  }
> => {
  const region = await db
    .select()
    .from(regions)
    .where(eq(regions.code, code))
    .limit(1);

  if (region.length === 0) {
    return null;
  }
  const regionId = region[0].id;

  const [citiesResult, universitiesResult, schoolsResult, studentCountResult] =
    await Promise.all([
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
};

// Manage cities in region
export const createCity = async (
  regionId: string,
  name: string,
  longitude: number,
  latitude: number,
): Promise<City> => {
  const [city] = await db
    .insert(cities)
    .values({
      id: crypto.randomUUID(),
      regionId,
      name,
      longitude: longitude,
      latitude: latitude,
    })
    .returning();

  return city;
};

// Get regional university placements
export const getUniversityPlacements = async (
  regionId: string,
  academicYear?: string,
) => {
  const conditions = [eq(cities.regionId, regionId)];

  if (academicYear) {
    conditions.push(eq(student_submissions.academicYear, academicYear));
  }

  return await db
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
    .where(and(...conditions));
};

// Get regional statistics
export const getRegionalStats = async (
  regionId: string,
): Promise<{
  totalCities: number;
  totalUniversities: number;
  totalSchools: number;
  totalStudents: number;
  activeStudents: number;
  totalSubmissions: number;
}> => {
  const [
    citiesCount,
    universitiesCount,
    schoolsCount,
    studentsCount,
    activeStudentsCount,
    submissionsCount,
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
  ]);

  return {
    totalCities: citiesCount[0].count,
    totalUniversities: universitiesCount[0].count,
    totalSchools: schoolsCount[0].count,
    totalStudents: studentsCount[0].count,
    activeStudents: activeStudentsCount[0].count,
    totalSubmissions: submissionsCount[0].count,
  };
};
