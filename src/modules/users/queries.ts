import { notFound } from "next/navigation";

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

  const profile = await prisma.user.findFirst({
    where: {
      id,
    },
    select: selectUserSafe,
  });

  if (!profile) {
    return notFound();
  }

  return profile;
}

export async function getMyProfile() {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: selectUserSafe,
  });

  if (!user) {
    throw new AuthorizationError();
  }

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
