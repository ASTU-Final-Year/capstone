import { and, eq, sql } from "drizzle-orm";
import { City, Region, School, University } from "../base";
import { db } from "../db";
import {
  cities,
  regions,
  schools,
  student_submissions,
  students,
  universities,
} from "../db/schema";

export const getCityDetails = async (
  cityId: string,
): Promise<
  City & {
    region: Region;
    schools: School[];
    universities: University[];
    studentCount: number;
  }
> => {
  const city = await db
    .select()
    .from(cities)
    .where(eq(cities.id, cityId))
    .limit(1);

  if (city.length === 0) {
    return null;
  }

  const [region, schoolsResults, universitiesResults, studentCountResult] =
    await Promise.all([
      db
        .select()
        .from(regions)
        .where(eq(regions.id, city[0].regionId))
        .limit(1),
      db.select().from(schools).where(eq(schools.cityId, cityId)),
      db
        .select()
        .from(universities)
        .where(eq(universities.regionId, city[0].regionId)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(students)
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .where(eq(schools.cityId, cityId)),
    ]);

  return {
    ...city[0],
    region: region[0],
    schools: schoolsResults,
    universities: universitiesResults,
    studentCount: studentCountResult[0]?.count || 0,
  };
};

// Manage schools in city
export const createSchool = async (
  cityId: string,
  name: string,
  code?: string,
  type?: string,
): Promise<School> => {
  const [school] = await db
    .insert(schools)
    .values({
      id: crypto.randomUUID(),
      cityId,
      name,
      code,
      type,
    })
    .returning();

  return school;
};

export const updateSchool = async (
  schoolId: string,
  updates: Partial<Pick<School, "name" | "code" | "type">>,
): Promise<School | null> => {
  const [updated] = await db
    .update(schools)
    .set(updates)
    .where(eq(schools.id, schoolId))
    .returning();

  return updated || null;
};

// Get city student statistics
export const getCityStudentStats = async (
  cityId: string,
  academicYear?: string,
): Promise<{
  totalStudents: number;
  activeStudents: number;
  averageGPA: number;
  submissionsCount: number;
  bySchool: Array<{
    schoolId: string;
    schoolName: string;
    studentCount: number;
    averageGPA: number;
  }>;
}> => {
  const baseCondition = eq(schools.cityId, cityId);
  const yearCondition = academicYear
    ? eq(student_submissions.academicYear, academicYear)
    : undefined;

  const [
    totalStudents,
    activeStudents,
    averageGPA,
    submissionsCount,
    bySchool,
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(baseCondition),
    db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(and(baseCondition, eq(students.isActive, true))),
    db
      .select({ avg: sql<number>`avg(${students.gpa})` })
      .from(students)
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(baseCondition),
    db
      .select({ count: sql<number>`count(*)` })
      .from(student_submissions)
      .innerJoin(students, eq(student_submissions.studentId, students.id))
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(yearCondition ? and(baseCondition, yearCondition) : baseCondition),
    db
      .select({
        schoolId: schools.id,
        schoolName: schools.name,
        studentCount: sql<number>`count(${students.id})`,
        averageGPA: sql<number>`avg(${students.gpa})`,
      })
      .from(students)
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(baseCondition)
      .groupBy(schools.id, schools.name),
  ]);

  return {
    totalStudents: totalStudents[0]?.count || 0,
    activeStudents: activeStudents[0]?.count || 0,
    averageGPA: averageGPA[0]?.avg || 0,
    submissionsCount: submissionsCount[0]?.count || 0,
    bySchool,
  };
};
