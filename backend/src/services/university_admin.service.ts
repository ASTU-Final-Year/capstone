import { and, eq, sql } from "drizzle-orm";
import {
  Region,
  Student,
  StudentSubmission,
  StudentUniversityPlacement,
  University,
  User,
} from "../base";
import { db } from "../db";
import {
  regions,
  student_submissions,
  student_university_placements,
  students,
  universities,
  users,
} from "../db/schema";

export const getUniversityDetails = async (
  universityId: string,
): Promise<
  University & {
    region: Region;
    placements: Array<
      StudentUniversityPlacement & {
        student: Student & { user: User };
      }
    >;
  }
> => {
  const university = await db
    .select()
    .from(universities)
    .where(eq(universities.id, universityId))
    .limit(1);

  if (university.length === 0) {
    throw new Error("University not found");
  }

  const [region, placements] = await Promise.all([
    db
      .select()
      .from(regions)
      .where(eq(regions.id, university[0].regionId))
      .limit(1),
    db
      .select()
      .from(student_university_placements)
      .where(eq(student_university_placements.unniversityId, universityId))
      .innerJoin(
        students,
        eq(student_university_placements.studentId, students.id),
      )
      .innerJoin(users, eq(students.id, users.id)),
  ]);

  return {
    ...university[0],
    region: region[0],
    placements: placements.map((p) => ({
      ...p.student_university_placements,
      student: {
        ...p.students,
        user: p.users as User,
      },
    })),
  };
};

// Get university capacity and usage
export const getUniversityCapacity = async (
  universityId: string,
  academicYear?: string,
): Promise<{
  totalCapacity: number;
  currentPlacements: number;
  availableSpots: number;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
}> => {
  const university = await db
    .select()
    .from(universities)
    .where(eq(universities.id, universityId))
    .limit(1);

  if (university.length === 0) {
    throw new Error("University not found");
  }

  const conditions = [
    eq(student_university_placements.unniversityId, universityId),
  ];

  if (academicYear) {
    conditions.push(eq(student_submissions.academicYear, academicYear));
  }

  const [placements, byStatus] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(student_university_placements)
      .where(eq(student_university_placements.unniversityId, universityId)),
    db
      .select({
        status: student_university_placements.status,
        count: sql<number>`count(*)`,
      })
      .from(student_university_placements)
      .where(eq(student_university_placements.unniversityId, universityId))
      .groupBy(student_university_placements.status),
  ]);

  const currentPlacements = placements[0]?.count || 0;
  const totalCapacity = university[0].capacity;

  return {
    totalCapacity,
    currentPlacements,
    availableSpots: Math.max(0, totalCapacity - currentPlacements),
    byStatus,
  };
};

// Review and update placement status
export const reviewPlacement = async (
  placementId: string,
  status: "under_review" | "approved" | "rejected",
): Promise<StudentUniversityPlacement | null> => {
  const [updated] = await db
    .update(student_university_placements)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(student_university_placements.id, placementId))
    .returning();

  return updated || null;
};

// Get placement applications for this university
export const getPlacementApplications = async (
  universityId: string,
  filters?: {
    status?: string;
    academicYear?: string;
  },
): Promise<
  (StudentUniversityPlacement & {
    student: Student & { user: User };
    submission: StudentSubmission;
  })[]
> => {
  const conditions = [
    eq(student_university_placements.unniversityId, universityId),
  ];

  if (filters?.status) {
    conditions.push(eq(student_university_placements.status, filters.status));
  }

  const results = await db
    .select()
    .from(student_university_placements)
    .where(and(...conditions))
    .innerJoin(
      students,
      eq(student_university_placements.studentId, students.id),
    )
    .innerJoin(users, eq(students.id, users.id))
    .innerJoin(
      student_submissions,
      eq(
        student_university_placements.studentId,
        student_submissions.studentId,
      ),
    );

  return results.map((r) => ({
    ...r.student_university_placements,
    student: {
      ...r.students,
      user: r.users as User,
    },
    submission: r.student_submissions,
  }));
};

// Update university information
export const updateUniversity = async (
  universityId: string,
  updates: Partial<
    Pick<
      University,
      | "name"
      | "abbreviation"
      | "longitude"
      | "latitude"
      | "capacity"
      | "website"
      | "contactEmail"
      | "contactPhone"
      | "isActive"
    >
  >,
): Promise<University | null> => {
  const [updated] = await db
    .update(universities)
    .set(updates)
    .where(eq(universities.id, universityId))
    .returning();

  return updated || null;
};
