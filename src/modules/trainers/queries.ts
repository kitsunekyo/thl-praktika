import { Prisma } from "@prisma/client";

import { AuthorizationError } from "@/lib/errors";
import { prisma, selectPublicUser } from "@/lib/prisma";
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

export async function getInvitedTrainers() {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  return await prisma.invitation.findMany({
    where: {
      role: "trainer",
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      address: true,
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

export async function getInvitedTrainerById(id: string) {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  return await prisma.invitation.findFirst({
    where: {
      role: "trainer",
      id,
    },
    select: {
      name: true,
      phone: true,
      email: true,
      address: true,
    },
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
        select: selectPublicUser,
      },
      trainer: {
        select: selectPublicUser,
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
        select: selectPublicUser,
      },
      registrations: {
        include: {
          user: {
            select: selectPublicUser,
          },
        },
      },
    },
    orderBy: {
      start: "desc",
    },
  });
}
