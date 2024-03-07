"use server";

import { revalidatePath } from "next/cache";

import { formatTrainingDate } from "@/lib/date";
import {
  sendRegistrationCancelledMail,
  sendTrainingRegistrationMail,
} from "@/lib/postmark";
import { prisma } from "@/lib/prisma";
import { auth } from "@/modules/auth/next-auth";

export async function register(id: string) {
  const session = await auth();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("not authorized");
  }

  const training = await prisma.training.findFirst({
    where: {
      id: id,
    },
    include: {
      registrations: true,
      author: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!training) {
    revalidatePath("/trainings");
    throw new Error("training not found");
  }

  const isRegisteredAlready = training.registrations
    .map((r) => r.userId)
    .includes(currentUser.id);

  if (isRegisteredAlready) {
    revalidatePath("/trainings");
    throw new Error("already registered");
  }

  const isMaximumCapacity =
    training.registrations.length >= training.maxInterns;

  if (isMaximumCapacity) {
    revalidatePath("/trainings");
    throw new Error("maximum capacity reached");
  }

  await prisma.registration.create({
    data: {
      trainingId: id,
      userId: currentUser.id,
    },
  });

  sendTrainingRegistrationMail({
    to: training.author.email,
    trainerName: training.author.name || "",
    date: formatTrainingDate(training.start, training.end),
    userName: currentUser.name || currentUser.email,
  });

  revalidatePath("/trainings");
}

export async function unregister(id: string) {
  const session = await auth();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("not authorized");
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
    throw new Error("registration not found");
  }

  await prisma.registration.delete({
    where: {
      id: registration.id,
    },
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
export async function deleteRegistration(id: string) {
  await prisma.registration.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/registrations");
}
