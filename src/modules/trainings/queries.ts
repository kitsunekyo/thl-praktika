import { prisma, selectUserSafe } from "@/lib/prisma";
import { auth } from "@/modules/auth/next-auth";

/**
 * returns the trainings the current user is registered for
 */
export async function getMyTrainings() {
  const session = await auth();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("not authorized");
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
      start: "asc",
    },
  });
}

/**
 * returns available trainings
 */
export async function getTrainings() {
  const trainings = await prisma.training.findMany({
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
}
