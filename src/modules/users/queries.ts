import { notFound } from "next/navigation";
import { cache } from "react";

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

export const getProfileById = cache(async (id: string) => {
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
});

export const getMyProfile = cache(async () => {
  const session = await getServerSession();
  if (!session) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: selectUserSafe,
  });

  return user;
});

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
