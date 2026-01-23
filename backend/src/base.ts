import { JWT, type JwtPayload, type JwtSymmetricAlgorithm } from "@bepalo/jwt";
import type { CTXAddress, RouterContext } from "@bepalo/router";

export const port = parseInt(Bun.env.BACKEND_PORT || "") || 4000;
export const url = Bun.env.URL || "http://localhost";
export const isProduction = Bun.env.NODE_ENV === "production";

if (!Bun.env.JWT_AUTH_KEY) throw new Error("null env JWT_AUTH_KEY");
if (!Bun.env.JWT_AUTH_ALG) throw new Error("null env JWT_AUTH_ALG");
const authJwtKey = Bun.env.JWT_AUTH_KEY;
const authJwtAlg = Bun.env.JWT_AUTH_ALG as JwtSymmetricAlgorithm;

export const jwts = {
  auth: JWT.createSymmetric(authJwtKey, authJwtAlg),
};

export type Role =
  | "super_admin"
  | "region_admin"
  | "city_admin"
  | "school_admin"
  | "university_admin"
  | "student";

export const ROLES: Role[] = [
  "super_admin",
  "region_admin",
  "city_admin",
  "school_admin",
  "university_admin",
  "student",
];

export type PermissionType = "register" | "view" | "update" | "delete";
export type PermissionTarget =
  | "self"
  | "university"
  | "region"
  | "city"
  | "school"
  | "own_student"
  | "student"
  | "own_student_submission"
  | "student_submission"
  | "own_placement"
  | "placement";
export type Permission = Partial<
  Record<PermissionType, Partial<Record<PermissionTarget, boolean>>>
>;
export type Permissions = Record<Role, Permission>;

export const PERMISSIONS: Permissions = {
  super_admin: {
    register: {
      region: true,
      university: true,
    },
    update: {
      self: true,
    },
  },
  university_admin: {
    view: {
      own_student: true,
    },
    update: {
      self: true,
    },
  },
  region_admin: {
    register: {
      city: true,
    },
    update: {
      self: true,
    },
  },
  city_admin: {
    register: {
      school: true,
    },
    update: {
      self: true,
    },
  },
  school_admin: {
    register: {
      student: true,
    },
    update: {
      self: true,
    },
  },
  student: {
    register: {
      self: true,
    },
    update: {
      self: true,
    },
  },
};

export interface UserSec {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type User = Omit<UserSec, "password">;

export interface Region {
  id: string;
  name: string;
  code: string;
}

export interface City {
  id: string;
  regionId: string;
  name: string;
  longitude: number;
  latitude: number;
  region?: Region;
}

export interface School {
  id: string;
  cityId: string;
  name: string;
  code: string;
  type: string;
  city?: City;
}

export interface Student {
  id: string;
  schoolId: string;
  nationalId: string;
  birthDate: Date;
  specialNeed: boolean | null;
  academicYear: string;
  gpa?: number;
  isActive?: boolean;
  user?: User | null;
  school?: {
    name: string;
  } | null;
  city?: {
    name: string;
  } | null;
  region?: {
    name: string;
  } | null;
}

export interface University {
  id: string;
  name: string;
  abbreviation: string;
  regionId: string;
  longitude: number;
  latitude: number;
  capacity: number;
  website: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  region?: Region;
}

export type StudentSubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

export interface UniversityChoice {
  universityId: string;
  rank: number;
  isAccepted?: boolean;
}

export interface StudentSubmission {
  id: string;
  studentId: string;
  academicYear: string;
  status: string | StudentSubmissionStatus;
  universityChoices: Array<UniversityChoice>;
  naturalScienceRank: number;
  socialScienceRank: number;
  teacherInNaturalScienceRank: number;
  teacherInSocialScienceRank: number;
  submittedAt: Date;
  approvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type StudentUniversityPlacementStatus =
  | "under_review"
  | "approved"
  | "rejected";

export interface StudentUniversityPlacement {
  id: string;
  studentId: string;
  unniversityId: string;
  status: string | StudentUniversityPlacementStatus;
  submittedAt: Date;
  approvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  student?: Student;
  unniversity?: University;
}

export interface Admin {
  id: string;
  userId: string;
  role: string;
  targetId: string;
  user?: User;
}

export interface CreateUserInput {
  fullname: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
}

export interface UpdateUserInput {
  fullname?: string;
  email?: string;
  password?: string;
  gender?: string;
  phone?: string;
}

export interface CreateStudentInput {
  nationalId: string;
  birthDate: Date;
  schoolId: string;
  academicYear: string;
  specialNeed?: boolean;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CTXSession {
  user: User;
  session: Session;
}

export type CTXMain = RouterContext & CTXAddress & CTXSession;
