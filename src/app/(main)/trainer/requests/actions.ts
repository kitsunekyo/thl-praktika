"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";

export async function createTrainingRequest({
  trainerId,
}: {
  trainerId: string;
}) {
  const session = await getServerSession();
  if (!session) {
    return {
      error: "not authorized",
    };
  }

  const existingRequest = await prisma.trainingRequest.findFirst({
    where: {
      userId: session.user.id,
      trainerId,
    },
  });

  if (existingRequest) {
    return {
      error: "only one request per trainer is allowed",
    };
  }

  await prisma.trainingRequest.create({
    data: {
      userId: session.user.id,
      trainerId: trainerId,
    },
  });

  revalidatePath("/trainer/requests");
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
        },
      },
      trainer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function deleteTrainingRequest(id: string) {
  await prisma.trainingRequest.delete({
    where: {
      id,
    },
  });

  revalidatePath("/trainer/requests");
}
