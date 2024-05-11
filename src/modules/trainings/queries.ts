import { cache } from "react";

import { AuthorizationError } from "@/lib/errors";
import { prisma, selectPublicUser } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/next-auth";

/**
 * returns the trainings the current user is registered for
 */
export async function getMyTrainings() {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new AuthorizationError();
  }

  return prisma.training.findMany({
    where: {
      registrations: {
        some: {
          userId: currentUser.id,
        },
      },
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
      start: "asc",
    },
  });
}

export const getAvailableTrainings = cache(async () => {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  const trainings = await prisma.training.findMany({
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
    where: {
      start: {
        gte: new Date(),
      },
    },
    orderBy: {
      start: "asc",
    },
  });

  return trainings;
});

export async function getTrainingsByAuthor(authorId: string) {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  const trainings = await prisma.training.findMany({
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
    where: {
      authorId,
    },
    orderBy: {
      start: "asc",
    },
  });

  return trainings;
}
