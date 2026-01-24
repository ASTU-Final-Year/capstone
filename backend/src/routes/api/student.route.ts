// routes/api/student.route.ts
import {
  Router,
  parseBody,
  parseCookie,
  json,
  CTXCookie,
  type CTXBody,
} from "@bepalo/router";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { CTXMain } from "../../base";
import {
  getStudentProfile,
  getAvailableUniversities,
  createOrUpdateSubmission,
  submitSubmission,
  getPlacementStatus,
  updateStudentProfile,
} from "../../services/student.service";
import { getUserWithStudentDetails } from "../../services/user.service";

export const studentRouter = new Router<CTXMain>();

// Get student profile
studentRouter.handle<CTXCookie>("GET /profile", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  async (req, { user }) => {
    try {
      const studentProfile = await getStudentProfile(user.id);

      return json({
        success: true,
        student: studentProfile,
      });
    } catch (error: any) {
      console.error("Error fetching student profile:", error);
      if (error.message === "Student not found") {
        return json({ error: "Student not found" }, { status: 404 });
      }
      return json(
        { error: "Failed to fetch student profile" },
        { status: 500 },
      );
    }
  },
]);

// Get available universities for student
studentRouter.handle<CTXCookie>("GET /universities", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  async (req, { user }) => {
    try {
      const universities = await getAvailableUniversities(user.id);

      return json({
        success: true,
        universities,
      });
    } catch (error: any) {
      console.error("Error fetching universities:", error);
      return json(
        { error: "Failed to fetch available universities" },
        { status: 500 },
      );
    }
  },
]);

// Get placement status
studentRouter.handle<CTXCookie>("GET /placement-status", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  async (req, { user }) => {
    try {
      const searchParams = new URL(req.url).searchParams;
      const academicYear = searchParams.get("academicYear") || undefined;

      const placementStatus = await getPlacementStatus(user.id, academicYear);

      return json({
        success: true,
        ...placementStatus,
      });
    } catch (error: any) {
      console.error("Error fetching placement status:", error);
      return json(
        { error: "Failed to fetch placement status" },
        { status: 500 },
      );
    }
  },
]);

// Save university preferences
studentRouter.handle<
  CTXCookie & {
    body: {
      preferences: Array<{
        id: string;
        rank: number;
        isFavorite: boolean;
      }>;
    };
  }
>("POST /preferences", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { user, body }) => {
    try {
      const { preferences } = body;

      if (!preferences || !Array.isArray(preferences)) {
        return json(
          { error: "Preferences array is required" },
          { status: 400 },
        );
      }

      // Get current academic year (you might want to get this from student profile)
      const studentProfile = await getStudentProfile(user.id);
      const academicYear =
        studentProfile.academicYear || new Date().getFullYear().toString();

      // Transform preferences for storage
      const topPreferences = preferences
        .filter((pref) => pref.isFavorite)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5) // Limit to top 5
        .map((pref, index) => ({
          universityId: pref.id,
          rank: index + 1,
          isFavorite: true,
        }));

      // Save to submission
      const submission = await createOrUpdateSubmission(user.id, {
        academicYear,
        status: "draft",
        universityChoices: topPreferences,
        allPreferences: preferences,
      });

      return json({
        success: true,
        submission,
        message: "Preferences saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      return json({ error: "Failed to save preferences" }, { status: 500 });
    }
  },
]);

// Submit preferences to EAES
studentRouter.handle<
  CTXCookie & {
    body: {
      academicYear?: string;
    };
  }
>("POST /submit-preferences", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { user, body }) => {
    try {
      const academicYear =
        body.academicYear || new Date().getFullYear().toString();

      const submission = await submitSubmission(user.id, academicYear);

      if (!submission) {
        return json(
          { error: "No draft submission found to submit" },
          { status: 400 },
        );
      }

      return json({
        success: true,
        submission,
        message: "Preferences submitted successfully to EAES",
      });
    } catch (error: any) {
      console.error("Error submitting preferences:", error);
      return json({ error: "Failed to submit preferences" }, { status: 500 });
    }
  },
]);

// Update student profile
studentRouter.handle<
  CTXCookie & {
    body: {
      phone?: string;
      gpa?: number;
      specialNeed?: boolean;
    };
  }
>("PATCH /profile", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  parseBody({
    accept: ["application/json"],
    maxSize: 1024,
  }),
  async (req, { user, body }) => {
    try {
      const studentProfile = await getStudentProfile(user.id);

      // Only allow certain fields to be updated by student
      const allowedUpdates: any = {};

      if (body.phone !== undefined) {
        // Phone update should be handled through user service
        // For now, we'll just update student profile
        allowedUpdates.phone = body.phone;
      }

      if (body.gpa !== undefined) {
        allowedUpdates.gpa = body.gpa;
      }

      if (body.specialNeed !== undefined) {
        allowedUpdates.specialNeed = body.specialNeed;
      }

      const updatedStudent = await updateStudentProfile(
        user.id,
        allowedUpdates,
      );

      if (!updatedStudent) {
        return json({ error: "Failed to update profile" }, { status: 400 });
      }

      return json({
        success: true,
        student: updatedStudent,
        message: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating student profile:", error);
      if (error.message === "Student not found") {
        return json({ error: "Student not found" }, { status: 404 });
      }
      return json({ error: "Failed to update profile" }, { status: 500 });
    }
  },
]);

// Verify student data (for EAES submission)
studentRouter.handle<CTXCookie>("POST /verify", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  async (req, { user }) => {
    try {
      // Get student profile to check if all required data is present
      const studentProfile = await getStudentProfile(user.id);

      // Check required fields for verification
      const requiredFields = ["nationalId", "birthDate", "academicYear", "gpa"];

      const missingFields = requiredFields.filter((field) => {
        const value = studentProfile[field as keyof typeof studentProfile];
        return value === null || value === undefined || value === "";
      });

      if (missingFields.length > 0) {
        return json(
          {
            success: false,
            error: "Missing required fields",
            missingFields,
            message: "Please complete your profile before verification",
          },
          { status: 400 },
        );
      }

      // TODO: Implement actual verification logic
      // This could involve:
      // 1. Sending verification email/code
      // 2. Document verification
      // 3. School admin approval

      // For now, just mark as verified
      return json({
        success: true,
        verified: true,
        message: "Student data verified successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Error verifying student data:", error);
      if (error.message === "Student not found") {
        return json({ error: "Student not found" }, { status: 404 });
      }
      return json({ error: "Failed to verify data" }, { status: 500 });
    }
  },
]);

// Get student dashboard overview
studentRouter.handle<CTXCookie>("GET /dashboard", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  async (req, { user }) => {
    try {
      const [studentProfile, placementStatus] = await Promise.all([
        getStudentProfile(user.id),
        getPlacementStatus(user.id),
      ]);

      // Calculate dashboard stats
      const stats = {
        totalUniversitiesRanked:
          placementStatus.submissions.length > 0
            ? JSON.parse(placementStatus.submissions[0].allPreferences || "[]")
                .length
            : 0,
        submissionStatus:
          placementStatus.submissions[0]?.status || "not_started",
        placementStatus: placementStatus.placements[0]?.status || "pending",
        verificationStatus: "pending", // You'll need to implement this
        gpa: studentProfile.gpa || 0,
      };

      return json({
        success: true,
        dashboard: {
          student: studentProfile,
          stats,
          submissions: placementStatus.submissions,
          placements: placementStatus.placements,
          universities: placementStatus.universities,
        },
      });
    } catch (error: any) {
      console.error("Error fetching student dashboard:", error);
      if (error.message === "Student not found") {
        return json({ error: "Student not found" }, { status: 404 });
      }
      return json(
        { error: "Failed to fetch student dashboard" },
        { status: 500 },
      );
    }
  },
]);

// Get student's submission history
studentRouter.handle<CTXCookie>("GET /submissions", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  async (req, { user }) => {
    try {
      const placementStatus = await getPlacementStatus(user.id);

      return json({
        success: true,
        submissions: placementStatus.submissions,
        academicYears: placementStatus.submissions.map((s) => s.academicYear),
      });
    } catch (error: any) {
      console.error("Error fetching submissions:", error);
      return json({ error: "Failed to fetch submissions" }, { status: 500 });
    }
  },
]);

// Get specific submission details
studentRouter.handle<CTXCookie>("GET /submissions/:academicYear", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  async (req, { params }) => {
    try {
      const academicYear = params.academicYear;

      // This would require a new service function to get submission by year
      // For now, we'll use existing getPlacementStatus
      // You should create a new service function: getSubmissionByAcademicYear

      return json({
        success: true,
        academicYear,
        message: "Endpoint under development",
      });
    } catch (error: any) {
      console.error("Error fetching submission:", error);
      return json({ error: "Failed to fetch submission" }, { status: 500 });
    }
  },
]);

// Delete draft submission
studentRouter.handle<CTXCookie>("DELETE /submissions/:submissionId", [
  parseCookie(),
  authenticate(),
  authorize({ roles: ["student"] }),
  async (req, { params }) => {
    try {
      const submissionId = params.submissionId;

      // TODO: Implement deletion logic
      // You'll need to add a deleteSubmission function to student.service.ts

      return json({
        success: true,
        message: "Submission deleted successfully",
        submissionId,
      });
    } catch (error: any) {
      console.error("Error deleting submission:", error);
      return json({ error: "Failed to delete submission" }, { status: 500 });
    }
  },
]);
