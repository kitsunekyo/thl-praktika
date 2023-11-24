"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/getServerSession";
import { sendTrainingRequestReceivedMail } from "@/lib/postmark";
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

  const trainer = await prisma.user.findFirst({
    where: {
      id: trainerId,
    },
  });

  if (!trainer) {
    return {
      error: "trainer does not exist",
    };
  }

  await prisma.trainingRequest.create({
    data: {
      userId: session.user.id,
      trainerId: trainerId,
    },
  });

  sendTrainingRequestReceivedMail({
    to: trainer.email,
    userName: session.user.name || session.user.email,
  });

  revalidatePath("/trainers/requests");
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

export async function deleteTrainingRequest(id: string) {
  await prisma.trainingRequest.delete({
    where: {
      id,
    },
  });

  revalidatePath("/trainers/requests");
}
