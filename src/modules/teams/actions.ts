"use server";

import { revalidatePath } from "next/cache";

import { AuthorizationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/next-auth";

export async function createTeam(name: string) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new AuthorizationError();
  }

  const res = await prisma.team.create({
    data: {
      name,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/teams");

  return res;
}

export async function inviteMember(teamId: string, userEmail: string) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new AuthorizationError();
  }

  const user = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    return {
      error: `userEmail ${userEmail} not found`,
    };
  }

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      ownerId: session.user.id,
      users: {
        none: {
          userId: user.email,
        },
      },
    },
    include: {
      users: true,
    },
  });

  if (!team) {
    return {
      error: `teamId ${teamId} not found`,
    };
  }

  await prisma.userOnTeam.create({
    data: {
      teamId,
      userId: user.id,
    },
  });

  revalidatePath("/teams");
}

export async function removeMember(teamId: string, userId: string) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new AuthorizationError();
  }

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      ownerId: session.user.id,
    },
    include: {
      users: true,
    },
  });

  if (!team) {
    return { error: "teamId not found" };
  }
}
