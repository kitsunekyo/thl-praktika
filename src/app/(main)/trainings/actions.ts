"use server";

import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/getServerSession";
import { prisma } from "@/lib/prisma";

export async function register(id: string) {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    return {
      error: "not authorized",
    };
  }

  const isRegisteredAlready =
    (await prisma.registration.findFirst({
      where: {
        userId: currentUser.id,
        id: id,
      },
    })) !== null;

  if (isRegisteredAlready) {
    return {
      error: "already registered",
    };
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
    return {
      error: "not authorized",
    };
  }

  const registration = await prisma.registration.findFirst({
    where: {
      trainingId: id,
      userId: currentUser.id,
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
  });
}
