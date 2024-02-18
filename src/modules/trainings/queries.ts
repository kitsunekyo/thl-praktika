import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/getServerSession";

export async function getMyTrainings() {
  const session = await getServerSession();
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
      author: true,
      registrations: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      start: "desc",
    },
  });
}

export async function getTrainings() {
  const trainings = await prisma.training.findMany({
    include: {
      author: true,
      registrations: {
        include: {
          user: true,
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
