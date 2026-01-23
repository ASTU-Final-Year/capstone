import { eq, and, or, sql } from "drizzle-orm";
import { db } from "../db";
import {
  cities,
  regions,
  schools,
  student_submissions,
  student_university_placements,
  students,
  universities,
  users,
} from "../db/schema";
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
import { randomUUID } from "crypto";

export const getStudentProfile = async (
  studentId: string,
): Promise<
  Student & {
    user: User;
    school: School & { city: City & { region: Region } };
    submissions: StudentSubmission[];
    placements: StudentUniversityPlacement[];
  }
> => {
  const student = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (student.length === 0) {
    throw new Error("Student not found");
  }

  const [user, schoolWithDetails, submissions, placements] = await Promise.all([
    db.select().from(users).where(eq(users.id, studentId)).limit(1),
    db
      .select()
      .from(schools)
      .where(eq(schools.id, student[0].schoolId))
      .innerJoin(cities, eq(schools.cityId, cities.id))
      .innerJoin(regions, eq(cities.regionId, regions.id))
      .limit(1),
    db
      .select()
      .from(student_submissions)
      .where(eq(student_submissions.studentId, studentId)),
    db
      .select()
      .from(student_university_placements)
      .where(eq(student_university_placements.studentId, studentId)),
  ]);

  return {
    ...student[0],
    user: user[0] as User,
    school: {
      ...schoolWithDetails[0].schools,
      city: {
        ...schoolWithDetails[0].cities,
        region: {
          ...schoolWithDetails[0].regions,
        },
      },
    },
    submissions,
    placements,
  };
};

// Create or update submission
export const createOrUpdateSubmission = async (
  studentId: string,
  submissionData: Omit<
    StudentSubmission,
    | "id"
    | "studentId"
    | "createdAt"
    | "updatedAt"
    | "submittedAt"
    | "approvedAt"
  >,
): Promise<StudentSubmission> => {
  // Check if submission already exists for this academic year
  const existing = await db
    .select()
    .from(student_submissions)
    .where(
      and(
        eq(student_submissions.studentId, studentId),
        eq(student_submissions.academicYear, submissionData.academicYear),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing submission
    const [updated] = await db
      .update(student_submissions)
      .set({
        ...submissionData,
        updatedAt: new Date(),
      })
      .where(eq(student_submissions.id, existing[0].id))
      .returning();

    return updated;
  } else {
    // Create new submission
    const [submission] = await db
      .insert(student_submissions)
      .values({
        studentId,
        id: randomUUID(),
        ...submissionData,
      })
      .returning();

    return submission;
  }
};

// Submit submission (change status from draft to submitted)
export const submitSubmission = async (
  studentId: string,
  academicYear: string,
): Promise<StudentSubmission | null> => {
  const [updated] = await db
    .update(student_submissions)
    .set({
      status: "submitted",
      submittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(student_submissions.studentId, studentId),
        eq(student_submissions.academicYear, academicYear),
        eq(student_submissions.status, "draft"),
      ),
    )
    .returning();
  return updated || null;
};

// Get available universities for student based on region
export const getAvailableUniversities = async (
  studentId: string,
): Promise<University[]> => {
  const student = await getStudentProfile(studentId);
  const regionId = student.school.city.regionId;
  return await db
    .select()
    .from(universities)
    .where(
      and(eq(universities.regionId, regionId), eq(universities.isActive, true)),
    )
    .orderBy(universities.name);
};

// Get placement status for student
export const getPlacementStatus = async (
  studentId: string,
  academicYear?: string,
): Promise<{
  submissions: StudentSubmission[];
  placements: StudentUniversityPlacement[];
  universities: Record<string, University>;
}> => {
  const conditions = [eq(student_submissions.studentId, studentId)];
  if (academicYear) {
    conditions.push(eq(student_submissions.academicYear, academicYear));
  }
  const [submissions, placements] = await Promise.all([
    db
      .select()
      .from(student_submissions)
      .where(and(...conditions)),
    db
      .select()
      .from(student_university_placements)
      .where(eq(student_university_placements.studentId, studentId)),
  ]);
  // Get university details for placements
  const universityIds = placements.map((p) => p.unniversityId);
  const universityResults =
    universityIds.length > 0
      ? await db
          .select()
          .from(universities)
          .where(sql`${universities.id} IN (${universityIds.join(",")})`)
          .then((results) =>
            results.reduce(
              (acc, uni) => {
                acc[uni.id] = uni;
                return acc;
              },
              {} as Record<string, University>,
            ),
          )
      : {};
  return {
    submissions,
    placements,
    universities: universityResults,
  };
};

// Update student profile
export const updateStudentProfile = async (
  studentId: string,
  updates: Partial<
    Pick<Student, "academicYear" | "gpa" | "isActive" | "specialNeed">
  >,
): Promise<Student | null> => {
  const [updated] = await db
    .update(students)
    .set(updates)
    .where(eq(students.id, studentId))
    .returning();

  return updated || null;
};
