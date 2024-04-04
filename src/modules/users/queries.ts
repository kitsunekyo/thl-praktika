import { prisma, selectUserSafe } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/next-auth";

export async function getUserProfiles() {
  return await prisma.user.findMany({
    where: {
      role: "user",
    },
    select: selectUserSafe,
  });
}
export async function getInvitations() {
  return await prisma.invitation.findMany();
}
export async function getProfileById(id: string) {
  const profile = prisma.user.findFirstOrThrow({
    where: {
      id,
    },
    select: selectUserSafe,
  });

  return profile;
}

export async function getMyProfile() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = prisma.user.findFirstOrThrow({
    where: {
      id: session.user.id,
    },
    select: selectUserSafe,
  });

  return user;
}
export async function getUsers() {
  return await prisma.user.findMany({
    select: selectUserSafe,
    orderBy: [
      {
        name: "asc",
      },
      {
        email: "asc",
      },
    ],
  });
}
