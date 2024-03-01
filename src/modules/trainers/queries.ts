import { Prisma } from "@prisma/client";

import { AuthenticationError } from "@/lib/errors";
import { prisma, selectUserSafe } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/getServerSession";

export async function getTrainers() {
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
    throw new AuthenticationError();
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
