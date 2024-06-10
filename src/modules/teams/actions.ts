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

  await prisma.team.update({
    where: {
      id: teamId,
      ownerId: session.user.id,
      users: {
        none: {
          email: userEmail,
        },
      },
    },
    data: {
      users: {
        connect: {
          email: userEmail,
        },
      },
    },
  });

  revalidatePath("/teams");
}

export async function removeMember(teamId: string, userId: string) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new AuthorizationError();
  }

  await prisma.team.update({
    where: {
      id: teamId,
      ownerId: session.user.id,
    },
    data: {
      users: {
        disconnect: {
          id: userId,
        },
      },
    },
  });

  revalidatePath("/teams");
}
