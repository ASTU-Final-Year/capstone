// import { text, uuid } from "drizzle-orm/gel-core";
import {
  pgTable,
  varchar,
  uuid,
  date,
  boolean,
  numeric,
  jsonb,
  timestamp,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().notNull(),
  fullname: varchar({ length: 40 }).notNull(),
  email: varchar({ length: 40 }).notNull().unique(),
  phone: varchar({ length: 16 }).notNull(),
  gender: varchar({ length: 12 }).notNull(),
  password: varchar({ length: 128 }).notNull(),
  role: varchar({ length: 16 }).notNull(),
  createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid().primaryKey().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  expiresAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  id: uuid().primaryKey().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" })
    .unique(),
  targetId: uuid().notNull(),
});

export const regions = pgTable("regions", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 64 }).notNull().unique(),
  code: varchar({ length: 10 }).unique(),
});

export const cities = pgTable(
  "cities",
  {
    id: uuid().primaryKey().notNull(),
    name: varchar({ length: 64 }).notNull(),
    longitude: numeric({ mode: "number", precision: 10, scale: 7 }).notNull(),
    latitude: numeric({ mode: "number", precision: 10, scale: 7 }).notNull(),
    regionId: uuid()
      .notNull()
      .references(() => regions.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
  },
  (table) => [
    // Ensure city names are unique within a region
    uniqueIndex("unique_city_in_region").on(table.name, table.regionId),
  ],
);

export const schools = pgTable("schools", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 64 }).notNull(),
  code: varchar({ length: 20 }), // School code/identifier
  type: varchar({ length: 20 }), // e.g., "public", "private", "international"
  cityId: uuid()
    .notNull()
    .references(() => cities.id, { onUpdate: "cascade", onDelete: "cascade" }),
});

export const students = pgTable("students", {
  id: uuid()
    .primaryKey()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  nationalId: varchar({ length: 32 }).notNull().unique(),
  birthDate: date({ mode: "date" }).notNull(),
  academicYear: varchar({ length: 10 }).notNull(),
  specialNeed: boolean().default(false),
  gpa: numeric({ mode: "number", precision: 5, scale: 2 }),
  isActive: boolean().default(true),
  schoolId: uuid()
    .notNull()
    .references(() => schools.id, { onUpdate: "cascade", onDelete: "cascade" }),
});

export const universities = pgTable("universities", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 96 }).notNull(),
  abbreviation: varchar({ length: 16 }).notNull(),
  regionId: uuid()
    .notNull()
    .references(() => regions.id, { onUpdate: "cascade", onDelete: "cascade" }),
  longitude: numeric({ mode: "number", precision: 10, scale: 7 }).notNull(),
  latitude: numeric({ mode: "number", precision: 10, scale: 7 }).notNull(),
  capacity: integer().notNull(),
  website: varchar({ length: 100 }),
  contactEmail: varchar({ length: 40 }),
  contactPhone: varchar({ length: 16 }),
  isActive: boolean().default(true),
});

export const student_submissions = pgTable("student_submissions", {
  id: uuid().primaryKey().notNull(),
  studentId: uuid()
    .notNull()
    .references(() => students.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  academicYear: varchar({ length: 10 }).notNull(),
  status: varchar({ length: 20 }).default("draft"), // "draft", "submitted", "under_review", "approved", "rejected"
  universityChoices: jsonb()
    .$type<
      Array<{
        universityId: string;
        rank: number;
        isAccepted?: boolean;
      }>
    >()
    .notNull(),
  naturalScienceRank: integer().notNull(),
  socialScienceRank: integer().notNull(),
  teacherInNaturalScienceRank: integer().notNull(),
  teacherInSocialScienceRank: integer().notNull(),
  submittedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  approvedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
});

export const student_university_placements = pgTable(
  "student_university_placements",
  {
    id: uuid().primaryKey().notNull(),
    studentId: uuid()
      .notNull()
      .references(() => students.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    unniversityId: uuid()
      .notNull()
      .references(() => universities.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    status: varchar({ length: 20 }).default("under_review"), // "under_review", "approved", "rejected"
    submittedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
    approvedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
    createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  },
);
