import { and, eq, sql, like, or } from "drizzle-orm";
import {
  City,
  Region,
  School,
  Student,
  StudentSubmission,
  StudentUniversityPlacement,
  University,
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
  universities,
} from "../db/schema";
import {
  createUser,
  generateRandomPassword,
  hashPassword,
} from "./user.service";

// 1. Get school details
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

// 2. Get students with filtering (non-paginated version)
export const getStudents = async (
  schoolId: string,
  filters?: {
    isActive?: boolean;
    academicYear?: string;
    hasSubmission?: boolean;
    limit?: number;
  },
): Promise<(Student & { user: User })[]> => {
  const conditions = [eq(students.schoolId, schoolId)];

  if (filters?.isActive !== undefined) {
    conditions.push(eq(students.isActive, filters.isActive));
  }

  if (filters?.academicYear) {
    conditions.push(eq(students.academicYear, filters.academicYear));
  }

  const query = db
    .select()
    .from(students)
    .innerJoin(users, eq(students.id, users.id))
    .where(and(...conditions));

  if (filters?.limit) {
    query.limit(filters.limit);
  }

  const results = await query;

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

// 3. Get student submissions from this school
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
    .select({
      student_submissions: student_submissions,
      student: students,
      user: users,
    })
    .from(student_submissions)
    .innerJoin(students, eq(student_submissions.studentId, students.id))
    .innerJoin(users, eq(students.id, users.id))
    .where(and(...conditions))
    .orderBy(student_submissions.submittedAt);

  return results.map((r) => ({
    ...r.student_submissions,
    student: {
      ...r.student,
      user: r.user as User,
    },
  }));
};

// 4. Get school statistics
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
    byAcademicYear: byAcademicYear.map((row) => ({
      academicYear: row.academicYear,
      studentCount: row.studentCount,
      submissionCount: row.submissionCount,
    })),
  };
};

// 5. Add new student to school
export const createStudent = async (
  userData: Omit<User, "id" | "createdAt" | "updatedAt"> & { password: string },
  studentData: Omit<Student, "id">,
): Promise<Student & { user: User }> => {
  return await db.transaction(async (tx) => {
    // Generate a random password
    const password = hashPassword(
      userData.password ? userData.password : generateRandomPassword(),
    );
    console.log({ password });
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

// 6. Get student performance analytics (existing)
export const getStudentPerformanceAnalytics = async (
  schoolId: string,
  academicYear?: string,
): Promise<{
  gpaDistribution: Array<{ range: string; count: number }>;
  submissionStatus: Record<string, number>;
  placementStatus: Record<string, number>;
  topPerformers: Array<{
    studentId: string;
    fullname: string;
    gpa: number;
    submissionStatus: string;
  }>;
}> => {
  const conditions = [eq(students.schoolId, schoolId)];

  if (academicYear) {
    conditions.push(eq(students.academicYear, academicYear));
  }

  const [studentsList, submissions, placements] = await Promise.all([
    db
      .select({
        student: students,
        user: users,
      })
      .from(students)
      .innerJoin(users, eq(students.id, users.id))
      .where(and(...conditions)),
    db
      .select()
      .from(student_submissions)
      .innerJoin(students, eq(student_submissions.studentId, students.id))
      .where(and(...conditions)),
    db
      .select()
      .from(student_university_placements)
      .innerJoin(
        students,
        eq(student_university_placements.studentId, students.id),
      )
      .where(and(...conditions)),
  ]);

  // Calculate GPA distribution
  const gpaDistribution = [
    { range: "0-1.9", count: 0 },
    { range: "2.0-2.4", count: 0 },
    { range: "2.5-2.9", count: 0 },
    { range: "3.0-3.4", count: 0 },
    { range: "3.5-4.0", count: 0 },
  ];

  studentsList.forEach(({ student }) => {
    if (student.gpa !== null) {
      if (student.gpa < 2.0) gpaDistribution[0].count++;
      else if (student.gpa < 2.5) gpaDistribution[1].count++;
      else if (student.gpa < 3.0) gpaDistribution[2].count++;
      else if (student.gpa < 3.5) gpaDistribution[3].count++;
      else gpaDistribution[4].count++;
    }
  });

  // Calculate submission status
  const submissionStatus = submissions.reduce(
    (acc, sub) => {
      acc[sub.student_submissions.status] =
        (acc[sub.student_submissions.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate placement status
  const placementStatus = placements.reduce(
    (acc, placement) => {
      acc[placement.student_university_placements.status] =
        (acc[placement.student_university_placements.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Get top performers (students with highest GPA)
  const topPerformers = studentsList
    .filter(({ student }) => student.gpa !== null)
    .sort((a, b) => (b.student.gpa || 0) - (a.student.gpa || 0))
    .slice(0, 10)
    .map(({ student, user }) => {
      const studentSubmission = submissions.find(
        (s) => s.students.id === student.id,
      );
      return {
        studentId: student.id,
        fullname: user.fullname,
        gpa: student.gpa || 0,
        submissionStatus:
          studentSubmission?.student_submissions.status || "no_submission",
      };
    });

  return {
    gpaDistribution,
    submissionStatus,
    placementStatus,
    topPerformers,
  };
};

// 7. Get students with pagination support (existing)
export const getStudentsWithPagination = async (
  schoolId: string,
  options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    academicYear?: string;
    hasSubmission?: boolean;
    search?: string;
  },
): Promise<{
  students: (Student & { user: User })[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 20));
  const offset = (page - 1) * limit;

  const conditions = [eq(students.schoolId, schoolId)];

  if (options?.isActive !== undefined) {
    conditions.push(eq(students.isActive, options.isActive));
  }

  if (options?.academicYear) {
    conditions.push(eq(students.academicYear, options.academicYear));
  }

  if (options?.search) {
    conditions.push(
      or(
        like(users.fullname, `%${options.search}%`),
        like(users.email, `%${options.search}%`),
        like(students.nationalId, `%${options.search}%`),
      ),
    );
  }

  // Get total count first
  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(students)
    .innerJoin(users, eq(students.id, users.id))
    .where(and(...conditions));

  const total = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  // Get paginated results
  const results = await db
    .select({
      student: students,
      user: users,
    })
    .from(students)
    .innerJoin(users, eq(students.id, users.id))
    .where(and(...conditions))
    .limit(limit)
    .offset(offset);

  let studentsList = results.map((r) => ({
    ...r.student,
    user: r.user as User,
  }));

  // Apply submission filter if needed
  if (options?.hasSubmission !== undefined) {
    const studentIds = studentsList.map((s) => s.id);
    const submissions = await db
      .select({ studentId: student_submissions.studentId })
      .from(student_submissions)
      .where(
        sql`${student_submissions.studentId} IN (${studentIds.join(",")})`,
      );

    const submittedStudentIds = new Set(submissions.map((s) => s.studentId));

    studentsList = studentsList.filter((student) =>
      options.hasSubmission
        ? submittedStudentIds.has(student.id)
        : !submittedStudentIds.has(student.id),
    );
  }

  return {
    students: studentsList,
    total,
    page,
    totalPages,
  };
};

// 8. Get school placements
export const getSchoolPlacements = async (
  schoolId: string,
  filters?: {
    status?: string;
    academicYear?: string;
  },
): Promise<
  (StudentUniversityPlacement & {
    student: Student & { user: User };
    university: University;
  })[]
> => {
  const conditions = [eq(students.schoolId, schoolId)];

  if (filters?.status) {
    conditions.push(eq(student_university_placements.status, filters.status));
  }

  if (filters?.academicYear) {
    conditions.push(eq(students.academicYear, filters.academicYear));
  }

  const results = await db
    .select({
      placement: student_university_placements,
      student: students,
      user: users,
      university: universities,
    })
    .from(student_university_placements)
    .innerJoin(
      students,
      eq(student_university_placements.studentId, students.id),
    )
    .innerJoin(users, eq(students.id, users.id))
    .innerJoin(
      universities,
      eq(student_university_placements.unniversityId, universities.id),
    )
    .where(and(...conditions))
    .orderBy(student_university_placements.createdAt);

  return results.map((r) => ({
    ...r.placement,
    student: {
      ...r.student,
      user: r.user as User,
    },
    university: r.university,
  }));
};
// Add this function to school_admin.service.ts

export const updateSchool = async (
  schoolId: string,
  updates: Partial<{
    name: string;
    type: string;
    code: string;
    contactPhone: string;
    contactEmail: string;
    principalName: string;
  }>,
): Promise<School> => {
  if (Object.keys(updates).length === 0) {
    throw new Error("No updates provided");
  }

  const [updatedSchool] = await db
    .update(schools)
    .set(updates)
    .where(eq(schools.id, schoolId))
    .returning();

  if (!updatedSchool) {
    throw new Error("School not found");
  }

  return updatedSchool;
};
