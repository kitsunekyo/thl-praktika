"use server";

import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";

export async function register(id: string) {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }

  const isRegisteredAlready =
    (await prisma.registration.findFirst({
      where: {
        userId: currentUser.id,
        id: id,
      },
    })) !== null;

  if (isRegisteredAlready) {
    throw new Error("Already registered");
  }

  await prisma.registration.create({
    data: {
      trainingId: id,
      userId: currentUser.id,
    },
  });
  revalidatePath("/");
}

export async function unregister(id: string) {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }

  const registration = await prisma.registration.findFirst({
    where: {
      trainingId: id,
      userId: currentUser.id,
    },
  });

  if (!registration) {
    throw new Error("Did not find registration");
  }

  await prisma.registration.delete({
    where: {
      id: registration.id,
    },
  });

  revalidatePath("/");
}

export async function getTrainnings() {
  const session = await getServerSession();
  const userId = session?.user.id;

  const trainings = await prisma.training.findMany({
    include: {
      author: true,
      registrations: true,
    },
  });

  return trainings.map((training) => ({
    ...training,
    isRegistered: training.registrations.some((r) => r.userId === userId),
  }));
}
