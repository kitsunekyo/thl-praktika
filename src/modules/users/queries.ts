import { AuthorizationError } from "@/lib/errors";
import { prisma, selectUserSafe } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/next-auth";

export async function getUserProfiles() {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  return await prisma.user.findMany({
    where: {
      role: "user",
    },
    select: selectUserSafe,
  });
}
export async function getInvitations() {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  return await prisma.invitation.findMany();
}
export async function getProfileById(id: string) {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

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
  if (!session) {
    throw new AuthorizationError();
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
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

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
