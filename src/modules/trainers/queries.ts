import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

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
  });
}

export async function getTrainingRequests(
  where: Prisma.TrainingRequestWhereInput,
) {
  return await prisma.trainingRequest.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
        },
      },
      trainer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
        },
      },
    },
  });
}
