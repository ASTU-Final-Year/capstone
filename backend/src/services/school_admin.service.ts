import { and, eq, sql } from "drizzle-orm";
import {
  City,
  Region,
  School,
  Student,
  StudentSubmission,
  User,
} from "../base";
import { db } from "../db";
import {
  cities,
  regions,
  schools,
  student_submissions,
  student_university_placements,
  students,
  users,
} from "../db/schema";
import { generateRandomPassword } from "./user.service";

export const getSchoolDetails = async (
  schoolId: string,
): Promise<
  School & {
    city: City & { region: Region };
    studentCount: number;
    activeStudentCount: number;
  }
> => {
  const school = await db
    .select()
    .from(schools)

    .where(eq(schools.id, schoolId))
    .limit(1);

  if (school.length === 0) {
    throw new Error("School not found");
  }

  const [cityWithRegion, studentCount, activeStudentCount] = await Promise.all([
    db
      .select()
      .from(cities)
      .where(eq(cities.id, school[0].cityId))
      .innerJoin(regions, eq(cities.regionId, regions.id))
      .limit(1)
      .then((results) => ({
        ...results[0].cities,
        region: results[0].regions,
      })),
    db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(eq(students.schoolId, schoolId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(and(eq(students.schoolId, schoolId), eq(students.isActive, true))),
  ]);

  return {
    ...school[0],
    city: cityWithRegion,
    studentCount: studentCount[0]?.count || 0,
    activeStudentCount: activeStudentCount[0]?.count || 0,
  };
};

// Manage students in school
export const getStudents = async (
  schoolId: string,
  filters?: {
    isActive?: boolean;
    academicYear?: string;
    hasSubmission?: boolean;
  },
): Promise<(Student & { user: User })[]> => {
  const conditions = [eq(students.schoolId, schoolId)];

  if (filters?.isActive !== undefined) {
    conditions.push(eq(students.isActive, filters.isActive));
  }

  if (filters?.academicYear) {
    conditions.push(eq(students.academicYear, filters.academicYear));
  }

  const results = await db
    .select()
    .from(students)
    .where(and(...conditions))
    .innerJoin(users, eq(students.id, users.id));

  if (filters?.hasSubmission !== undefined) {
    // Filter students who have/haven't submitted
    const studentIds = results.map((r) => r.students.id);
    const submissions = await db
      .select({ studentId: student_submissions.studentId })
      .from(student_submissions)
      .where(
        sql`${student_submissions.studentId} IN (${studentIds.join(",")})`,
      );

    const submittedStudentIds = new Set(submissions.map((s) => s.studentId));

    return results
      .filter((r) =>
        filters.hasSubmission
          ? submittedStudentIds.has(r.students.id)
          : !submittedStudentIds.has(r.students.id),
      )
      .map((r) => ({
        ...r.students,
        user: r.users as User,
      }));
  }

  return results.map((r) => ({
    ...r.students,
    user: r.users as User,
  }));
};

// Get student submissions from this school
export const getSchoolSubmissions = async (
  schoolId: string,
  academicYear?: string,
): Promise<
  (StudentSubmission & {
    student: Student & { user: User };
  })[]
> => {
  const conditions = [eq(students.schoolId, schoolId)];

  if (academicYear) {
    conditions.push(eq(student_submissions.academicYear, academicYear));
  }

  const results = await db
    .select()
    .from(student_submissions)
    .innerJoin(students, eq(student_submissions.studentId, students.id))
    .innerJoin(users, eq(students.id, users.id))
    .where(and(...conditions));

  return results.map((r) => ({
    ...r.student_submissions,
    student: {
      ...r.students,
      user: r.users as User,
    },
  }));
};

// Add new student to school
export const createStudent = async (
  userData: Omit<User, "id" | "createdAt" | "updatedAt"> & { password: string },
  studentData: Omit<Student, "id">,
): Promise<Student & { user: User }> => {
  return await db.transaction(async (tx) => {
    // Generate a random password
    const password = userData.password
      ? userData.password
      : generateRandomPassword();
    const [user] = await tx
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        password,
        ...userData,
      })
      .returning();

    const [student] = await tx
      .insert(students)
      .values({
        id: user.id,
        ...studentData,
        schoolId: studentData.schoolId,
      })
      .returning();

    return {
      ...student,
      user: user as User,
    };
  });
};

// Get school statistics
export const getSchoolStats = async (
  schoolId: string,
  academicYear?: string,
): Promise<{
  totalStudents: number;
  activeStudents: number;
  averageGPA: number;
  specialNeedsCount: number;
  submissionsCount: number;
  approvedPlacements: number;
  byAcademicYear: Array<{
    academicYear: string;
    studentCount: number;
    submissionCount: number;
  }>;
}> => {
  const baseCondition = eq(students.schoolId, schoolId);
  const yearCondition = academicYear
    ? eq(student_submissions.academicYear, academicYear)
    : undefined;

  const [
    totalStudents,
    activeStudents,
    averageGPA,
    specialNeedsCount,
    submissionsCount,
    approvedPlacements,
    byAcademicYear,
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(baseCondition),
    db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(and(baseCondition, eq(students.isActive, true))),
    db
      .select({ avg: sql<number>`avg(${students.gpa})` })
      .from(students)
      .where(baseCondition),
    db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(and(baseCondition, eq(students.specialNeed, true))),
    db
      .select({ count: sql<number>`count(*)` })
      .from(student_submissions)
      .innerJoin(students, eq(student_submissions.studentId, students.id))
      .where(yearCondition ? and(baseCondition, yearCondition) : baseCondition),
    db
      .select({ count: sql<number>`count(*)` })
      .from(student_university_placements)
      .innerJoin(
        students,
        eq(student_university_placements.studentId, students.id),
      )
      .where(
        and(
          baseCondition,
          eq(student_university_placements.status, "approved"),
        ),
      ),
    db
      .select({
        academicYear: students.academicYear,
        studentCount: sql<number>`count(${students.id})`,
        submissionCount: sql<number>`count(${student_submissions.id})`,
      })
      .from(students)
      .leftJoin(
        student_submissions,
        eq(students.id, student_submissions.studentId),
      )
      .where(baseCondition)
      .groupBy(students.academicYear),
  ]);

  return {
    totalStudents: totalStudents[0]?.count || 0,
    activeStudents: activeStudents[0]?.count || 0,
    averageGPA: averageGPA[0]?.avg || 0,
    specialNeedsCount: specialNeedsCount[0]?.count || 0,
    submissionsCount: submissionsCount[0]?.count || 0,
    approvedPlacements: approvedPlacements[0]?.count || 0,
    byAcademicYear,
  };
};
