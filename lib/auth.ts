import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { UserRole } from "@prisma/client";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  let dbUser = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.firstName || user.emailAddresses[0]?.emailAddress || "",
      },
    });
  }

  return dbUser;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== UserRole.ADMIN) {
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}
