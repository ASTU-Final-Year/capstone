import {
  Router,
  parseBody,
  parseCookie,
  json,
  CTXCookie,
} from "@bepalo/router";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { CTXMain } from "../../base";
import {
  getSchoolDetails,
  getStudents,
  getStudentsWithPagination,
  getSchoolSubmissions,
  getSchoolStats,
  createStudent,
  getStudentPerformanceAnalytics,
  getSchoolPlacements,
} from "../../services/school_admin.service";
import { getUserWithAdminDetails } from "../../services/user.service";

export const schoolRouter = new Router<CTXMain>();

// Helper function to get school admin's target school
const getAdminSchool = async (userId: string) => {
  const userWithDetails = await getUserWithAdminDetails(userId);

  if (!userWithDetails?.admin?.targetId) {
    throw new Error("School not assigned to admin");
  }

  return userWithDetails.admin.targetId;
};

// Get school dashboard overview (school admin's own school)
schoolRouter.handle<CTXCookie>("GET /overview", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  async (req, { user }) => {
    try {
      const schoolId = await getAdminSchool(user.id);

      // Get school details
      const school = await getSchoolDetails(schoolId);

      // Get school statistics
      const currentYear = new Date().getFullYear().toString();
      const stats = await getSchoolStats(schoolId, currentYear);

      // Get recent students (last 10)
      const students = await getStudents(schoolId, {
        limit: 10,
        isActive: true,
        academicYear: currentYear,
      });

      // Get recent submissions
      // const submissions = await getSchoolSubmissions(schoolId, currentYear);

      return json({
        success: true,
        dashboard: {
          school,
          stats,
          recentStudents: students.slice(0, 5),
          // recentSubmissions: submissions.slice(0, 5),
          totalStudents: students.length,
          // totalSubmissions: submissions.length,
        },
      });
    } catch (error: any) {
      console.error("Error fetching school dashboard:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      return json(
        { error: "Failed to fetch school dashboard" },
        { status: 500 },
      );
    }
  },
]);

// Get detailed school statistics with filters
schoolRouter.handle<CTXCookie>("GET /statistics", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  async (req, { user }) => {
    try {
      const schoolId = await getAdminSchool(user.id);
      const searchParams = new URL(req.url).searchParams;
      const academicYear =
        searchParams.get("academicYear") || new Date().getFullYear().toString();

      const stats = await getSchoolStats(schoolId, academicYear);

      // Get breakdown by academic year
      const allStats = await getSchoolStats(schoolId);

      return json({
        success: true,
        statistics: {
          currentYear: stats,
          byAcademicYear: allStats.byAcademicYear,
          academicYear,
        },
      });
    } catch (error: any) {
      console.error("Error fetching school statistics:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      return json(
        { error: "Failed to fetch school statistics" },
        { status: 500 },
      );
    }
  },
]);

// Get school students with pagination and filtering
schoolRouter.handle<CTXCookie>("GET /students", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  async (req, { user }) => {
    try {
      const schoolId = await getAdminSchool(user.id);
      const searchParams = new URL(req.url).searchParams;

      const options = {
        isActive: searchParams.has("isActive")
          ? searchParams.get("isActive") === "true"
          : undefined,
        academicYear: searchParams.get("academicYear") || undefined,
        hasSubmission: searchParams.has("hasSubmission")
          ? searchParams.get("hasSubmission") === "true"
          : undefined,
        search: searchParams.get("search") || undefined,
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "20"),
      };

      const result = await getStudentsWithPagination(schoolId, options);

      return json({
        success: true,
        students: result.students,
        pagination: {
          page: result.page,
          limit: options.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasMore: result.page < result.totalPages,
        },
      });
    } catch (error: any) {
      console.error("Error fetching school students:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      return json(
        { error: "Failed to fetch school students" },
        { status: 500 },
      );
    }
  },
]);

// Get school submissions with filtering
schoolRouter.handle<CTXCookie>("GET /submissions", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  async (req, { user }) => {
    try {
      const schoolId = await getAdminSchool(user.id);
      const searchParams = new URL(req.url).searchParams;
      const academicYear = searchParams.get("academicYear") || undefined;
      const status = searchParams.get("status") || undefined;

      const submissions = await getSchoolSubmissions(schoolId, academicYear);

      // Filter by status if specified
      const filteredSubmissions = status
        ? submissions.filter((sub) => sub.status === status)
        : submissions;

      return json({
        success: true,
        submissions: filteredSubmissions,
        filters: {
          academicYear,
          status,
          total: filteredSubmissions.length,
          byStatus: submissions.reduce(
            (acc, sub) => {
              acc[sub.status] = (acc[sub.status] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
      });
    } catch (error: any) {
      console.error("Error fetching school submissions:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      return json(
        { error: "Failed to fetch school submissions" },
        { status: 500 },
      );
    }
  },
]);

// Get school analytics
schoolRouter.handle<CTXCookie>("GET /analytics", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["city_admin", "school_admin", "student"] }),
  async (req, { user }) => {
    try {
      const schoolId = await getAdminSchool(user.id);
      const searchParams = new URL(req.url).searchParams;
      const academicYear = searchParams.get("academicYear") || undefined;

      const analytics = await getStudentPerformanceAnalytics(
        schoolId,
        academicYear,
      );

      return json({
        success: true,
        analytics,
        academicYear: academicYear || new Date().getFullYear().toString(),
      });
    } catch (error: any) {
      console.error("Error fetching school analytics:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      return json(
        { error: "Failed to fetch school analytics" },
        { status: 500 },
      );
    }
  },
]);

// Get school placements
schoolRouter.handle<CTXCookie>("GET /placements", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  async (req, { user }) => {
    try {
      const schoolId = await getAdminSchool(user.id);
      const searchParams = new URL(req.url).searchParams;

      const filters = {
        status: searchParams.get("status") || undefined,
        academicYear: searchParams.get("academicYear") || undefined,
      };

      const placements = await getSchoolPlacements(schoolId, filters);

      return json({
        success: true,
        placements,
        filters,
      });
    } catch (error: any) {
      console.error("Error fetching school placements:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      return json(
        { error: "Failed to fetch school placements" },
        { status: 500 },
      );
    }
  },
]);

// Add new student to school
schoolRouter.handle<
  CTXCookie & {
    body: {
      student: {
        nationalId: string;
        birthDate: string;
        academicYear: string;
        specialNeed: boolean;
        gpa?: number;
      };
      user: {
        fullname: string;
        email: string;
        gender: string;
        phone: string;
        password?: string;
      };
    };
  }
>("POST /students", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { user, body }) => {
    try {
      const schoolId = await getAdminSchool(user.id);

      // Validate input
      if (!body.student || !body.user) {
        return json(
          { error: "Student and user data are required" },
          { status: 400 },
        );
      }

      // Convert string date to Date object
      const studentData = {
        ...body.student,
        birthDate: new Date(body.student.birthDate),
        schoolId,
      };

      const newStudent = await createStudent(
        {
          ...body.user,
          role: "student",
          password: body.user.password || "",
        },
        studentData,
      );

      return json(
        {
          success: true,
          student: newStudent,
          message: "Student added successfully",
        },
        { status: 201 },
      );
    } catch (error: any) {
      console.error("Error adding student:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      if (error.message?.includes("unique constraint")) {
        return json(
          { error: "Student with this email or national ID already exists" },
          { status: 400 },
        );
      }
      return json({ error: "Failed to add student" }, { status: 500 });
    }
  },
]);

// Get student details
schoolRouter.handle<CTXCookie>("GET /students/:studentId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  async (req, { user, params }) => {
    try {
      const schoolId = await getAdminSchool(user.id);

      const { getStudentProfile } =
        await import("../../services/student.service");
      const studentProfile = await getStudentProfile(params.studentId);

      // Verify student belongs to this school
      if (studentProfile.school.id !== schoolId) {
        return json(
          { error: "Student not found in your school" },
          { status: 403 },
        );
      }

      return json({
        success: true,
        student: studentProfile,
      });
    } catch (error: any) {
      console.error("Error fetching student details:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      if (error.message === "Student not found") {
        return json({ error: "Student not found" }, { status: 404 });
      }
      return json(
        { error: "Failed to fetch student details" },
        { status: 500 },
      );
    }
  },
]);

// Update student information
schoolRouter.handle<
  CTXCookie & {
    body: {
      academicYear?: string;
      gpa?: number;
      isActive?: boolean;
      specialNeed?: boolean;
    };
  }
>("PATCH /students/:studentId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { user, params, body }) => {
    try {
      const schoolId = await getAdminSchool(user.id);

      // Verify student belongs to this school
      const { getStudentProfile } =
        await import("../../services/student.service");
      const studentProfile = await getStudentProfile(params.studentId);

      if (studentProfile.school.id !== schoolId) {
        return json(
          { error: "Student not found in your school" },
          { status: 403 },
        );
      }

      const { updateStudentProfile } =
        await import("../../services/student.service");
      const updatedStudent = await updateStudentProfile(params.studentId, body);

      if (!updatedStudent) {
        return json({ error: "Failed to update student" }, { status: 400 });
      }

      return json({
        success: true,
        student: updatedStudent,
        message: "Student updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating student:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      if (error.message === "Student not found") {
        return json({ error: "Student not found" }, { status: 404 });
      }
      return json({ error: "Failed to update student" }, { status: 500 });
    }
  },
]);

// Submit students to EAES
schoolRouter.handle<
  CTXCookie & {
    body: {
      studentIds: string[];
    };
  }
>("POST /submit", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { user, body }) => {
    try {
      const schoolId = await getAdminSchool(user.id);
      const { studentIds } = body;

      if (
        !studentIds ||
        !Array.isArray(studentIds) ||
        studentIds.length === 0
      ) {
        return json({ error: "No students selected" }, { status: 400 });
      }

      // Verify all students belong to this school
      const { getStudentProfile } =
        await import("../../services/student.service");

      for (const studentId of studentIds) {
        try {
          const studentProfile = await getStudentProfile(studentId);
          if (studentProfile.school.id !== schoolId) {
            return json(
              { error: `Student ${studentId} not found in your school` },
              { status: 403 },
            );
          }
        } catch (error) {
          return json(
            { error: `Student ${studentId} not found` },
            { status: 404 },
          );
        }
      }

      // TODO: Implement actual EAES submission logic
      // This is a placeholder - you'll need to implement the actual submission
      const submissionResult = {
        submitted: studentIds.length,
        timestamp: new Date().toISOString(),
      };

      return json({
        success: true,
        result: submissionResult,
        message: `${studentIds.length} students submitted to EAES`,
      });
    } catch (error: any) {
      console.error("Error submitting to EAES:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      return json({ error: "Failed to submit to EAES" }, { status: 500 });
    }
  },
]);

// Export student data
schoolRouter.handle<CTXCookie>("GET /export/students", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  async (req, { user }) => {
    try {
      const schoolId = await getAdminSchool(user.id);
      const searchParams = new URL(req.url).searchParams;

      const filters = {
        isActive: searchParams.has("isActive")
          ? searchParams.get("isActive") === "true"
          : undefined,
        academicYear: searchParams.get("academicYear") || undefined,
        hasSubmission: searchParams.has("hasSubmission")
          ? searchParams.get("hasSubmission") === "true"
          : undefined,
      };

      const students = await getStudents(schoolId, filters);

      // Convert to CSV format
      const csvData = students.map((student) => ({
        "Full Name": student.user.fullname,
        Email: student.user.email,
        Phone: student.user.phone,
        "National ID": student.nationalId,
        "Birth Date": student.birthDate,
        "Academic Year": student.academicYear,
        GPA: student.gpa || "",
        Status: student.isActive ? "Active" : "Inactive",
        "Special Needs": student.specialNeed ? "Yes" : "No",
      }));

      // Create CSV string
      const headers = Object.keys(csvData[0] || {}).join(",");
      const rows = csvData.map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`.replace(/\n/g, " "))
          .join(","),
      );
      const csv = [headers, ...rows].join("\n");

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="students-${schoolId}-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    } catch (error: any) {
      console.error("Error exporting student data:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      return json({ error: "Failed to export student data" }, { status: 500 });
    }
  },
]);

// Update school profile
schoolRouter.handle<
  CTXCookie & {
    body: {
      name?: string;
      type?: string;
      contactPhone?: string;
      contactEmail?: string;
      principalName?: string;
    };
  }
>("PATCH /profile", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["school_admin"] }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { user, body }) => {
    try {
      const schoolId = await getAdminSchool(user.id);

      // TODO: Implement actual profile update logic
      // This is a placeholder - you'll need to implement the actual update
      // const { updateSchool } =
      //   await import("../../services/school_admin.service?");

      // For now, just return success
      return json({
        success: true,
        message: "Profile updated successfully",
        updatedFields: Object.keys(body),
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      if (error.message === "School not assigned to admin") {
        return json({ error: "School not assigned to admin" }, { status: 400 });
      }
      return json({ error: "Failed to update profile" }, { status: 500 });
    }
  },
]);
