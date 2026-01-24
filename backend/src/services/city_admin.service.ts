// city_admin.service.ts
import { and, eq, sql, desc, asc, like, or, ne } from "drizzle-orm";
import {
  City,
  Region,
  School,
  University,
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
  students,
  universities,
  student_university_placements,
  users,
} from "../db/schema";

// Types for better type safety
export interface CityWithDetails extends City {
  region: Region;
  schools: School[];
  universities: University[];
  studentCount: number;
}

export interface CityStats {
  totalStudents: number;
  activeStudents: number;
  averageGPA: number;
  submissionsCount: number;
  placementCount: number;
  bySchool: Array<{
    schoolId: string;
    schoolName: string;
    studentCount: number;
    averageGPA: number;
    submissionsCount: number;
  }>;
  byAcademicYear: Array<{
    academicYear: string;
    studentCount: number;
    submissionsCount: number;
  }>;
}

export interface SchoolWithDetails extends School {
  studentCount: number;
  averageGPA: number;
  submissionsCount: number;
  city: City;
  region: Region;
}

export interface StudentWithDetails extends Student {
  user?: User;
  school?: School;
  submissions?: StudentSubmission[];
}

// Utility function to validate UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Get city details with all related data
export const getCityDetails = async (
  cityId: string,
): Promise<CityWithDetails | null> => {
  if (!isValidUUID(cityId)) {
    throw new Error("Invalid city ID format");
  }

  try {
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
  } catch (error) {
    console.error("Error fetching city details:", error);
    throw new Error("Failed to fetch city details");
  }
};

// Get city statistics with comprehensive data
export const getCityStats = async (
  cityId: string,
  options?: {
    academicYear?: string;
  },
): Promise<CityStats> => {
  if (!isValidUUID(cityId)) {
    throw new Error("Invalid city ID format");
  }

  const academicYear = options?.academicYear;
  const baseCondition = eq(schools.cityId, cityId);
  const yearCondition = academicYear
    ? eq(student_submissions.academicYear, academicYear)
    : undefined;

  try {
    const [
      totalStudents,
      activeStudents,
      averageGPA,
      submissionsCount,
      placementCount,
      bySchool,
      byAcademicYear,
    ] = await Promise.all([
      db
        .select({ count: sql<number>`count(DISTINCT ${students.id})` })
        .from(students)
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .where(baseCondition),
      db
        .select({ count: sql<number>`count(DISTINCT ${students.id})` })
        .from(students)
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .where(and(baseCondition, eq(students.isActive, true))),
      db
        .select({ avg: sql<number>`avg(${students.gpa})` })
        .from(students)
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .where(baseCondition),
      db
        .select({
          count: sql<number>`count(DISTINCT ${student_submissions.id})`,
        })
        .from(student_submissions)
        .innerJoin(students, eq(student_submissions.studentId, students.id))
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .where(
          yearCondition ? and(baseCondition, yearCondition) : baseCondition,
        ),
      db
        .select({
          count: sql<number>`count(DISTINCT ${student_university_placements.id})`,
        })
        .from(student_university_placements)
        .innerJoin(
          students,
          eq(student_university_placements.studentId, students.id),
        )
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .where(baseCondition),
      db
        .select({
          schoolId: schools.id,
          schoolName: schools.name,
          studentCount: sql<number>`count(DISTINCT ${students.id})`,
          averageGPA: sql<number>`avg(${students.gpa})`,
          submissionsCount: sql<number>`count(DISTINCT ${student_submissions.id})`,
        })
        .from(schools)
        .leftJoin(students, eq(schools.id, students.schoolId))
        .leftJoin(
          student_submissions,
          eq(students.id, student_submissions.studentId),
        )
        .where(eq(schools.cityId, cityId))
        .groupBy(schools.id, schools.name),
      db
        .select({
          academicYear: student_submissions.academicYear,
          studentCount: sql<number>`count(DISTINCT ${students.id})`,
          submissionsCount: sql<number>`count(DISTINCT ${student_submissions.id})`,
        })
        .from(student_submissions)
        .innerJoin(students, eq(student_submissions.studentId, students.id))
        .innerJoin(schools, eq(students.schoolId, schools.id))
        .where(baseCondition)
        .groupBy(student_submissions.academicYear)
        .orderBy(desc(student_submissions.academicYear)),
    ]);

    return {
      totalStudents: totalStudents[0]?.count || 0,
      activeStudents: activeStudents[0]?.count || 0,
      averageGPA: averageGPA[0]?.avg || 0,
      submissionsCount: submissionsCount[0]?.count || 0,
      placementCount: placementCount[0]?.count || 0,
      bySchool: bySchool.map((row) => ({
        schoolId: row.schoolId,
        schoolName: row.schoolName,
        studentCount: row.studentCount || 0,
        averageGPA: row.averageGPA || 0,
        submissionsCount: row.submissionsCount || 0,
      })),
      byAcademicYear: byAcademicYear.map((row) => ({
        academicYear: row.academicYear,
        studentCount: row.studentCount || 0,
        submissionsCount: row.submissionsCount || 0,
      })),
    };
  } catch (error) {
    console.error("Error fetching city statistics:", error);
    throw new Error("Failed to fetch city statistics");
  }
};

// Manage schools in city
export const createSchool = async (
  cityId: string,
  name: string,
  code?: string,
  type?: string,
): Promise<School> => {
  if (!isValidUUID(cityId)) {
    throw new Error("Invalid city ID format");
  }

  if (!name || name.trim().length === 0) {
    throw new Error("School name is required");
  }

  if (name.length > 64) {
    throw new Error("School name must be less than 64 characters");
  }

  try {
    // Check if city exists
    const cityExists = await db
      .select({ id: cities.id })
      .from(cities)
      .where(eq(cities.id, cityId))
      .limit(1);

    if (cityExists.length === 0) {
      throw new Error("City not found");
    }

    // Check for duplicate school name in the city
    const existingSchool = await db
      .select({ id: schools.id })
      .from(schools)
      .where(and(eq(schools.cityId, cityId), eq(schools.name, name.trim())))
      .limit(1);

    if (existingSchool.length > 0) {
      throw new Error("School with this name already exists in this city");
    }

    const [school] = await db
      .insert(schools)
      .values({
        id: crypto.randomUUID(),
        cityId,
        name: name.trim(),
        code: code?.trim(),
        type: type?.trim(),
      })
      .returning();

    return school;
  } catch (error: any) {
    console.error("Error creating school:", error);
    if (
      error.message.includes("duplicate") ||
      error.message.includes("unique")
    ) {
      throw new Error("School name already exists in this city");
    }
    if (error.message === "City not found") {
      throw new Error("City not found");
    }
    throw new Error("Failed to create school");
  }
};

// Update school
export const updateSchool = async (
  schoolId: string,
  updates: Partial<Pick<School, "name" | "code" | "type">>,
): Promise<School> => {
  if (!isValidUUID(schoolId)) {
    throw new Error("Invalid school ID format");
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No updates provided");
  }

  // Validate name if provided
  if (updates.name !== undefined) {
    if (updates.name.trim().length === 0) {
      throw new Error("School name cannot be empty");
    }
    if (updates.name.length > 64) {
      throw new Error("School name must be less than 64 characters");
    }
    updates.name = updates.name.trim();
  }

  // Validate code if provided
  if (updates.code !== undefined && updates.code) {
    if (updates.code.length > 20) {
      throw new Error("School code must be less than 20 characters");
    }
    updates.code = updates.code.trim();
  }

  // Validate type if provided
  if (updates.type !== undefined && updates.type) {
    if (updates.type.length > 20) {
      throw new Error("School type must be less than 20 characters");
    }
    updates.type = updates.type.trim();
  }

  try {
    const [updatedSchool] = await db
      .update(schools)
      .set(updates)
      .where(eq(schools.id, schoolId))
      .returning();

    if (!updatedSchool) {
      throw new Error("School not found");
    }

    return updatedSchool;
  } catch (error: any) {
    console.error("Error updating school:", error);
    if (
      error.message.includes("duplicate") ||
      error.message.includes("unique")
    ) {
      throw new Error("School name already exists in this city");
    }
    throw new Error("Failed to update school");
  }
};

// Delete school
export const deleteSchool = async (schoolId: string): Promise<boolean> => {
  if (!isValidUUID(schoolId)) {
    throw new Error("Invalid school ID format");
  }

  try {
    // Check if school has any students
    const studentsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(eq(students.schoolId, schoolId));

    if (studentsCount[0].count > 0) {
      throw new Error(
        "Cannot delete school that has students. Transfer or delete students first.",
      );
    }

    const result = await db
      .delete(schools)
      .where(eq(schools.id, schoolId))
      .returning({ id: schools.id });

    return result.length > 0;
  } catch (error: any) {
    console.error("Error deleting school:", error);
    if (error.message.includes("Cannot delete")) {
      throw error;
    }
    throw new Error("Failed to delete school");
  }
};

// Get schools in city with filtering and pagination
export const getSchools = async (
  cityId: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
    withStats?: boolean;
    type?: string;
  },
): Promise<{
  schools: School[] | SchoolWithDetails[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  if (!isValidUUID(cityId)) {
    throw new Error("Invalid city ID format");
  }

  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 20));
  const offset = (page - 1) * limit;
  const search = options?.search?.trim();
  const withStats = options?.withStats || false;
  const type = options?.type;

  try {
    // Base conditions
    const conditions = [eq(schools.cityId, cityId)];

    if (search) {
      conditions.push(
        or(
          like(schools.name, `%${search}%`),
          like(schools.code, `%${search}%`),
        ),
      );
    }

    if (type) {
      conditions.push(eq(schools.type, type));
    }

    if (withStats) {
      const schoolsWithStats = await db
        .select({
          school: schools,
          studentCount: sql<number>`COUNT(DISTINCT ${students.id})`,
          averageGPA: sql<number>`AVG(${students.gpa})`,
          submissionsCount: sql<number>`COUNT(DISTINCT ${student_submissions.id})`,
          city: cities,
          region: regions,
        })
        .from(schools)
        .innerJoin(cities, eq(schools.cityId, cities.id))
        .innerJoin(regions, eq(cities.regionId, regions.id))
        .leftJoin(students, eq(schools.id, students.schoolId))
        .leftJoin(
          student_submissions,
          eq(students.id, student_submissions.studentId),
        )
        .where(and(...conditions))
        .groupBy(schools.id, cities.id, regions.id)
        .orderBy(asc(schools.name))
        .limit(limit)
        .offset(offset);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${schools.id})` })
        .from(schools)
        .where(and(...conditions));

      const total = totalResult[0].count;
      const totalPages = Math.ceil(total / limit);

      return {
        schools: schoolsWithStats.map((row) => ({
          ...row.school,
          studentCount: row.studentCount || 0,
          averageGPA: row.averageGPA || 0,
          submissionsCount: row.submissionsCount || 0,
          city: row.city,
          region: row.region,
        })),
        total,
        page,
        totalPages,
      };
    } else {
      const schoolsList = await db
        .select()
        .from(schools)
        .where(and(...conditions))
        .orderBy(asc(schools.name))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(schools)
        .where(and(...conditions));

      const total = totalResult[0].count;
      const totalPages = Math.ceil(total / limit);

      return {
        schools: schoolsList,
        total,
        page,
        totalPages,
      };
    }
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw new Error("Failed to fetch schools");
  }
};

// Get students in city with filtering
export const getStudents = async (
  cityId: string,
  options?: {
    schoolId?: string;
    academicYear?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  },
): Promise<{
  students: StudentWithDetails[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  if (!isValidUUID(cityId)) {
    throw new Error("Invalid city ID format");
  }

  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 20));
  const offset = (page - 1) * limit;
  const schoolId = options?.schoolId;
  const academicYear = options?.academicYear;
  const isActive = options?.isActive;
  const search = options?.search?.trim();

  try {
    console.log(typeof schoolId, schoolId);
    // Base conditions - students in schools in this city
    const conditions = [eq(schools.cityId, cityId)];

    if (schoolId) {
      if (!isValidUUID(schoolId)) {
        throw new Error("Invalid school ID format");
      }
      conditions.push(eq(students.schoolId, schoolId));
    }

    if (academicYear) {
      conditions.push(eq(students.academicYear, academicYear));
    }

    if (isActive !== undefined) {
      conditions.push(eq(students.isActive, isActive));
    }

    if (search) {
      conditions.push(
        or(
          like(students.nationalId, `%${search}%`),
          sql`EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = students.id 
            AND (LOWER(users.fullname) LIKE LOWER(${`%${search}%`})
                 OR LOWER(users.email) LIKE LOWER(${`%${search}%`}))
          )`,
        ),
      );
    }

    // Get students with user and school info
    const studentsList = await db
      .select({
        student: students,
        user: users,
        school: schools,
      })
      .from(students)
      .innerJoin(users, eq(students.id, users.id))
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    // Get submissions for these students
    const studentIds = studentsList.map((row) => row.student.id);
    let submissions: any[] = [];

    if (studentIds.length > 0) {
      submissions = await db
        .select()
        .from(student_submissions)
        .where(eq(student_submissions.studentId, studentIds[0])); // Simplified for example
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(DISTINCT ${students.id})` })
      .from(students)
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(and(...conditions));

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    return {
      students: studentsList.map((row) => ({
        ...row.student,
        user: row.user,
        school: row.school,
        submissions: submissions.filter((s) => s.studentId === row.student.id),
      })),
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  }
};

// Get student submissions in city
export const getStudentSubmissions = async (
  cityId: string,
  options?: {
    schoolId?: string;
    academicYear?: string;
    status?: string;
    page?: number;
    limit?: number;
  },
) => {
  if (!isValidUUID(cityId)) {
    throw new Error("Invalid city ID format");
  }

  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 20));
  const offset = (page - 1) * limit;
  const schoolId = options?.schoolId;
  const academicYear = options?.academicYear;
  const status = options?.status;

  try {
    const conditions = [eq(schools.cityId, cityId)];

    if (schoolId) {
      conditions.push(eq(schools.id, schoolId));
    }

    if (academicYear) {
      conditions.push(eq(student_submissions.academicYear, academicYear));
    }

    if (status) {
      conditions.push(eq(student_submissions.status, status));
    }

    const submissions = await db
      .select({
        submission: student_submissions,
        student: students,
        user: users,
        school: schools,
      })
      .from(student_submissions)
      .innerJoin(students, eq(student_submissions.studentId, students.id))
      .innerJoin(users, eq(students.id, users.id))
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(and(...conditions))
      .orderBy(desc(student_submissions.submittedAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(student_submissions)
      .innerJoin(students, eq(student_submissions.studentId, students.id))
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(and(...conditions));

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    return {
      submissions,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    throw new Error("Failed to fetch student submissions");
  }
};
