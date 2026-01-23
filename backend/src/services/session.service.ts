import { eq, and, gte, lt } from "drizzle-orm";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import { userCache, sessionCache, sessionBlacklistCache } from "../caches";
import { type Session, type User } from "../base";

// Create a new session
export const createSession = async (
  userId: string,
  maxAgeSeconds: number = 24 * 60 * 60,
): Promise<string> => {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);
  const [session] = await db
    .insert(sessions)
    .values({
      id: sessionId,
      userId,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  if (!session) throw new Error("Failed to create session");
  // Add to cache
  sessionCache.set(sessionId, {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  });
  return sessionId;
};

// Validate and get session
export const validateSession = async (
  sessionId: string,
): Promise<Session | null> => {
  // Check blacklist first
  if (sessionBlacklistCache.get(sessionId)) {
    return null;
  }
  // Try to get from cache first
  const cachedSession = sessionCache.get(sessionId)?.value;
  if (cachedSession) {
    // Check if cached session is still valid
    if (cachedSession.expiresAt > new Date()) {
      return cachedSession;
    }
    // Remove from cache if expired
    sessionCache.delete(sessionId);
    return null;
  }
  // If not in cache, check database
  const [session] = await db
    .select({
      id: sessions.id,
      userId: sessions.userId,
      expiresAt: sessions.expiresAt,
      createdAt: sessions.createdAt,
      updatedAt: sessions.updatedAt,
    })
    .from(sessions)
    .where(
      and(eq(sessions.id, sessionId), gte(sessions.expiresAt, new Date())),
    );
  if (!session) return null;
  // Cache the session
  sessionCache.set(sessionId, session);
  return session;
};

// Get user by session
export const getUserBySession = async (
  sessionId: string,
): Promise<User | null> => {
  const session = await validateSession(sessionId);
  if (!session) {
    return null;
  }
  // Try to get user from cache
  const cachedUser = userCache.get(session.userId)?.value;
  if (cachedUser) {
    return cachedUser;
  }
  // If not in cache, fetch from database
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
    .where(eq(users.id, session.userId));
  if (!user) return null;
  // Cache the user (without password)
  userCache.set(session.userId, user);
  return user;
};

// Get user and session by session
export const getUserAndSessionBySession = async (
  sessionId: string,
): Promise<{ user: User; session: Session } | null> => {
  const session = await validateSession(sessionId);
  if (!session) {
    return null;
  }
  // Try to get user from cache
  const cachedUser = userCache.get(session.userId)?.value;
  if (cachedUser) {
    return { user: cachedUser, session };
  }
  // If not in cache, fetch from database
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
    .where(eq(users.id, session.userId));
  if (!user) return null;
  // Cache the user (without password)
  userCache.set(session.userId, user);
  return { user, session };
};

// Delete a session
export const deleteSession = async (sessionId: string): Promise<boolean> => {
  // Add to blacklist first
  sessionBlacklistCache.set(sessionId, true);
  // Delete from cache
  sessionCache.delete(sessionId);
  // Delete from database
  await db.delete(sessions).where(eq(sessions.id, sessionId));
  return true;
};

// Logout user (delete all sessions)
export const logoutUser = async (userId: string): Promise<boolean> => {
  // Get all sessions for user
  const userSessions = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(eq(sessions.userId, userId));
  // Delete all sessions
  await db.delete(sessions).where(eq(sessions.userId, userId));
  // Clear from cache
  userSessions.forEach((session) => {
    sessionCache.delete(session.id);
    sessionBlacklistCache.set(session.id, true);
  });
  // Clear user cache
  userCache.delete(userId);
  return true;
};

// Cleanup expired sessions
export const cleanupExpiredSessions = async (): Promise<void> => {
  const expiredSessions = await db
    .delete(sessions)
    .where(lt(sessions.expiresAt, new Date()))
    .returning({ id: sessions.id, userId: sessions.userId });
  // Clear them from cache
  expiredSessions.forEach((session) => {
    sessionCache.delete(session.id);
    userCache.delete(session.userId); // Also clear user cache
  });
  // console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
};

// Refresh session
export const refreshSession = async (
  sessionId: string,
  maxAgeSeconds: number = 24 * 60 * 60,
): Promise<boolean> => {
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);
  const [updatedSession] = await db
    .update(sessions)
    .set({
      expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(sessions.id, sessionId))
    .returning();
  if (!updatedSession) return false;
  // Update cache
  sessionCache.set(sessionId, {
    id: updatedSession.id,
    userId: updatedSession.userId,
    expiresAt: updatedSession.expiresAt,
    createdAt: updatedSession.createdAt,
    updatedAt: updatedSession.updatedAt,
  });
  return true;
};
