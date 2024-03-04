import { prisma, selectUserSafe } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/getServerSession";

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
export async function getProfile() {
  const session = await getServerSession();

  if (!session?.user) {
    return null;
  }

  const user = prisma.user.findFirst({
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
