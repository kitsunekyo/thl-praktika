import { Prisma } from "@prisma/client";

import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { prisma, selectUserSafe } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/next-auth";

export async function getTrainers() {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  return await prisma.user.findMany({
    where: { role: "trainer" },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      address: true,
      city: true,
      zipCode: true,
      phone: true,
      lastLogin: true,
    },
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

export async function getTrainingRequests(
  where: Prisma.TrainingRequestWhereInput,
) {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  return await prisma.trainingRequest.findMany({
    where,
    include: {
      user: {
        select: selectUserSafe,
      },
      trainer: {
        select: selectUserSafe,
      },
    },
  });
}
export async function getMyTrainings() {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  return prisma.training.findMany({
    where: {
      authorId: session.user.id,
    },
    include: {
      author: {
        select: selectUserSafe,
      },
      registrations: {
        include: {
          user: {
            select: selectUserSafe,
          },
        },
      },
    },
    orderBy: {
      start: "desc",
    },
  });
}
