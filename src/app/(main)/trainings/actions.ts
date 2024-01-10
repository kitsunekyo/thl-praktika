"use server";

import { revalidatePath } from "next/cache";

import { formatTrainingDate } from "@/lib/date";
import { getServerSession } from "@/lib/getServerSession";
import { sendRegistrationCancelledMail } from "@/lib/postmark";
import { prisma } from "@/lib/prisma";

export async function register(id: string) {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    return {
      error: "not authorized",
    };
  }

  const training = await prisma.training.findFirst({
    where: {
      id: id,
    },
    include: {
      registrations: true,
    },
  });

  if (!training) {
    revalidatePath("/trainings");
    return {
      error: "training not found",
    };
  }

  const isRegisteredAlready = training.registrations
    .map((r) => r.userId)
    .includes(currentUser.id);

  if (isRegisteredAlready) {
    revalidatePath("/trainings");
    return {
      error: "already registered",
    };
  }

  const isMaximumCapacity =
    training.registrations.length >= training.maxInterns;

  if (isMaximumCapacity) {
    revalidatePath("/trainings");
    return {
      error: "maximum capacity reached",
    };
  }

  await prisma.registration.create({
    data: {
      trainingId: id,
      userId: currentUser.id,
    },
  });
  revalidatePath("/trainings");
}

export async function unregister(id: string) {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    return {
      error: "not authorized",
    };
  }

  const registration = await prisma.registration.findFirst({
    where: {
      trainingId: id,
      userId: currentUser.id,
    },
    include: {
      training: {
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!registration) {
    return {
      error: "registration not found",
    };
  }

  await prisma.registration.delete({
    where: {
      id: registration.id,
    },
  });

  console.log("DEBUG - unregister");
  console.log({
    date: {
      start: registration.training.start,
      end: registration.training.end,
    },
    formatted: formatTrainingDate(
      registration.training.start,
      registration.training.end,
    ),
  });

  sendRegistrationCancelledMail({
    to: registration.training.author.email,
    trainerName: registration.training.author.name || "",
    user: currentUser.name || currentUser.email,
    date: formatTrainingDate(
      registration.training.start,
      registration.training.end,
    ),
  });

  revalidatePath("/");
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

export async function getMyTrainings() {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("could not get user");
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
