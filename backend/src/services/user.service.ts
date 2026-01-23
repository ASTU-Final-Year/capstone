import { eq, and, like, ilike, inArray, sql, or } from "drizzle-orm";
import { db } from "../db";
import {
  users,
  students,
  admins,
  schools,
  cities,
  regions,
  type users as UserSchema,
  type students as StudentSchema,
  type admins as AdminSchema,
} from "../db/schema";
import { userCache } from "../caches";
import {
  type User,
  type Student,
  type Admin,
  type CreateUserInput,
  type UpdateUserInput,
  type CreateStudentInput,
  type Role,
} from "../base";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { securityConfig } from "../config";

// Generate a random password for new users
export const generateRandomPassword = (length: number = 12): string => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, securityConfig.saltRounds);
};

// Verify password
export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Authenticate user
export const authenticateUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  const [user] = await db
    .select({
      id: users.id,
      fullname: users.fullname,
      email: users.email,
      password: users.password,
      gender: users.gender,
      phone: users.phone,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.email, email));
  if (!user) return null;
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  // Cache the user
  userCache.set(user.id, userWithoutPassword);
  return userWithoutPassword;
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  // Try cache first
  const cachedUser = userCache.get(userId)?.value;
  if (cachedUser) {
    return cachedUser;
  }
  // Fetch from database
  const [user] = await db
    .select({
      id: users.id,
      fullname: users.fullname,
      email: users.email,
      gender: users.gender,
      phone: users.phone,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId));
  if (!user) return null;
  // Cache the user
  userCache.set(userId, user);
  return user;
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [user] = await db
    .select({
      id: users.id,
      fullname: users.fullname,
      email: users.email,
      gender: users.gender,
      phone: users.phone,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.email, email));
  if (!user) return null;
  // Cache the user
  userCache.set(user.id, user);
  return user;
};

// Create a new user
export const createUser = async (input: CreateUserInput): Promise<User> => {
  // Hash password
  const hashedPassword = await hashPassword(input.password);
  const [user] = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      fullname: input.fullname,
      email: input.email,
      password: hashedPassword,
      gender: input.gender,
      phone: input.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: users.id,
      fullname: users.fullname,
      email: users.email,
      gender: users.gender,
      phone: users.phone,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });
  if (!user) throw new Error("Failed to create user");
  // Cache the new user
  userCache.set(user.id, user);
  return user;
};

// Create a new student user
export const createStudentUser = async (
  userInput: CreateUserInput & { password?: string },
  studentInput: CreateStudentInput,
): Promise<{ user: User; student: Student }> => {
  // Generate a random password
  const password = userInput.password
    ? userInput.password
    : generateRandomPassword();
  // Create the user first
  const user = await createUser({
    ...userInput,
    password,
  });
  // Create the student record
  const [student] = await db
    .insert(students)
    .values({
      id: user.id,
      nationalId: studentInput.nationalId,
      birthDate: studentInput.birthDate,
      academicYear: studentInput.academicYear,
      specialNeed: studentInput.specialNeed || false,
      schoolId: studentInput.schoolId,
    })
    .returning();
  if (!student) {
    // Rollback user creation if student creation fails
    await db.delete(users).where(eq(users.id, user.id));
    throw new Error("Failed to create student record");
  }
  return { user, student };
};

// Create a new admin user
export const createAdminUser = async (
  userInput: CreateUserInput & { password?: string },
  adminInput: {
    targetId: string;
    role: Role;
  },
): Promise<{ user: User; admin: Admin }> => {
  // Generate a random password
  const password = userInput.password
    ? userInput.password
    : generateRandomPassword();
  // Create the user first
  const user = await createUser({
    ...userInput,
    password,
  });
  // Create the admin record
  const [admin] = await db
    .insert(admins)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
      role: adminInput.role,
      targetId: adminInput.targetId,
    })
    .returning();
  if (!admin) {
    // Rollback user creation if admin creation fails
    await db.delete(users).where(eq(users.id, user.id));
    throw new Error("Failed to create admin record");
  }
  return { user, admin };
};

// Update user
export const updateUser = async (
  userId: string,
  input: UpdateUserInput,
): Promise<User | null> => {
  const updateData: any = {
    updatedAt: new Date(),
  };
  if (input.fullname !== undefined) updateData.fullname = input.fullname;
  if (input.email !== undefined) updateData.email = input.email;
  if (input.gender !== undefined) updateData.gender = input.gender;
  if (input.phone !== undefined) updateData.phone = input.phone;
  if (input.password !== undefined) {
    updateData.password = await hashPassword(input.password);
  }
  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      fullname: users.fullname,
      email: users.email,
      gender: users.gender,
      phone: users.phone,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });
  if (!updatedUser) return null;
  // Update cache
  userCache.set(userId, updatedUser);
  return updatedUser;
};

// Delete user
export const deleteUser = async (userId: string): Promise<boolean> => {
  // Delete from database (cascade will handle related records)
  await db.delete(users).where(eq(users.id, userId));
  // Clear from cache
  userCache.delete(userId);
  return true;
};

// Search users
export const searchUsers = async (
  query: string,
  limit: number = 50,
  offset: number = 0,
): Promise<User[]> => {
  const userList = await db
    .select({
      id: users.id,
      fullname: users.fullname,
      email: users.email,
      gender: users.gender,
      phone: users.phone,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(
      or(
        ilike(users.fullname, `%${query}%`),
        ilike(users.email, `%${query}%`),
        like(users.phone, `%${query}%`),
      ),
    )
    .limit(limit)
    .offset(offset)
    .orderBy(users.createdAt);
  // Cache each user
  userList.forEach((user) => {
    userCache.set(user.id, user);
  });
  return userList;
};

// Get users by IDs
export const getUsersByIds = async (userIds: string[]): Promise<User[]> => {
  if (userIds.length === 0) return [];
  // Check cache first
  const cachedUsers: User[] = [];
  const missingIds: string[] = [];
  userIds.forEach((id) => {
    const cachedUser = userCache.get(id)?.value;
    if (cachedUser) {
      cachedUsers.push(cachedUser);
    } else {
      missingIds.push(id);
    }
  });
  // If all users are cached, return them
  if (missingIds.length === 0) {
    return cachedUsers;
  }
  // Fetch missing users from database
  const dbUsers = await db
    .select({
      id: users.id,
      fullname: users.fullname,
      email: users.email,
      gender: users.gender,
      phone: users.phone,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(inArray(users.id, missingIds));
  // Cache fetched users
  dbUsers.forEach((user) => {
    userCache.set(user.id, user);
  });
  return [...cachedUsers, ...dbUsers];
};

// Get user with student details
export const getUserWithStudentDetails = async (
  userId: string,
): Promise<(User & { student?: Student }) | null> => {
  const [result] = await db
    .select({
      user: {
        id: users.id,
        fullname: users.fullname,
        email: users.email,
        gender: users.gender,
        phone: users.phone,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
      student: {
        id: students.id,
        nationalId: students.nationalId,
        birthDate: students.birthDate,
        specialNeed: students.specialNeed,
        academicYear: students.academicYear,
        gpa: students.gpa,
        isActive: students.isActive,
        schoolId: students.schoolId,
      },
      school: {
        name: schools.name,
      },
      city: {
        name: cities.name,
      },
      region: {
        name: regions.name,
      },
    })
    .from(users)
    .leftJoin(students, eq(users.id, students.id))
    .leftJoin(schools, eq(students.schoolId, schools.id))
    .leftJoin(cities, eq(schools.cityId, cities.id))
    .leftJoin(regions, eq(cities.regionId, regions.id))
    .where(eq(users.id, userId));
  if (!result?.user) return null;
  const userWithDetails: User & { student?: Student & { school?: any } } =
    result.user;
  if (result.student) {
    userWithDetails.student = {
      ...result.student,
      school: result.school,
      city: result.city,
      region: result.region,
    };
  }
  // Cache the user
  userCache.set(userId, result.user);
  return userWithDetails;
};

// Get user with admin details
export const getUserWithAdminDetails = async (
  userId: string,
): Promise<(User & { admin?: Admin }) | null> => {
  const [result] = await db
    .select({
      user: {
        id: users.id,
        fullname: users.fullname,
        email: users.email,
        gender: users.gender,
        phone: users.phone,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
      admin: {
        id: admins.id,
        userId: admins.userId,
        role: admins.role,
        targetId: admins.targetId,
      },
    })
    .from(users)
    .leftJoin(admins, eq(users.id, admins.userId))
    .where(eq(users.id, userId));

  if (!result?.user) return null;

  const userWithDetails: User & { admin?: Admin } = result.user;
  if (result.admin) {
    userWithDetails.admin = result.admin;
  }

  // Cache the user
  userCache.set(userId, result.user);

  return userWithDetails;
};

// Get user count
export const getUserCount = async (): Promise<number> => {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  return result?.count ?? 0;
};

// Reset user password
export const resetUserPassword = async (
  userId: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Clear user from cache since password changed
    userCache.delete(userId);

    return true;
  } catch (error) {
    console.error("Error resetting user password:", error);
    return false;
  }
};

// Get all students with pagination
export const getAllStudents = async (
  limit: number = 50,
  offset: number = 0,
  filters?: {
    schoolId?: string;
    cityId?: string;
    regionId?: string;
    academicYear?: string;
  },
): Promise<(User & { student: Student })[]> => {
  try {
    let query = db
      .select({
        user: {
          id: users.id,
          fullname: users.fullname,
          email: users.email,
          gender: users.gender,
          phone: users.phone,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        student: {
          id: students.id,
          nationalId: students.nationalId,
          birthDate: students.birthDate,
          specialNeed: students.specialNeed,
          academicYear: students.academicYear,
          gpa: students.gpa,
          isActive: students.isActive,
          schoolId: students.schoolId,
        },
        school: {
          id: schools.id,
          name: schools.name,
        },
        city: {
          id: cities.id,
          name: cities.name,
        },
        region: {
          id: regions.id,
          name: regions.name,
        },
      })
      .from(users)
      .innerJoin(students, eq(users.id, students.id))
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .innerJoin(cities, eq(schools.cityId, cities.id))
      .innerJoin(regions, eq(cities.regionId, regions.id));

    // Apply filters
    const conditions = [];
    if (filters?.schoolId)
      conditions.push(eq(students.schoolId, filters.schoolId));
    if (filters?.cityId) conditions.push(eq(schools.cityId, filters.cityId));
    if (filters?.regionId)
      conditions.push(eq(cities.regionId, filters.regionId));
    if (filters?.academicYear)
      conditions.push(eq(students.academicYear, filters.academicYear));
    const results = await (
      conditions.length > 0 ? query.where(and(...conditions)) : query
    )
      .limit(limit)
      .offset(offset)
      .orderBy(users.createdAt);

    return results.map((result) => ({
      ...result.user,
      student: {
        ...result.student,
        school: result.school,
        city: result.city,
        region: result.region,
      },
    }));
  } catch (error) {
    console.error("Error getting all students:", error);
    return [];
  }
};
