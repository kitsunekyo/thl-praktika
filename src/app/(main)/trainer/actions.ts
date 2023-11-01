"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { formatTrainingDate } from "@/lib/date";
import { getServerSession } from "@/lib/next-auth";
import {
  sendTrainingCancelledMail,
  sendTrainingRegistrationNotificationMail,
} from "@/lib/postmark";
import { prisma } from "@/lib/prisma";

export async function getMyTrainings() {
  const session = await getServerSession();
  if (!session) {
    return [];
  }

  return prisma.training.findMany({
    where: {
      authorId: session.user.id,
      start: {
        gte: new Date(),
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
      start: "asc",
    },
  });
}

export async function deleteTraining(id: string) {
  const training = await prisma.training.findFirst({
    where: {
      id,
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

  if (!training) {
    return {
      error: "training not found",
    };
  }

  await prisma.training.delete({
    where: {
      id,
    },
  });

  const registeredUsers = training.registrations.map((r) => r.user.email);
  registeredUsers.forEach((email) => {
    sendTrainingCancelledMail({
      to: email,
      trainer: training.author.name || "Ein:e Trainer:in",
      date: formatTrainingDate(training.start, training.end),
    });
  });

  revalidatePath("/trainers");
}

const createTrainingSchema = z.object({
  description: z.string().optional(),
  start: z.date(),
  end: z.date(),
  maxInterns: z.number(),
  address: z.string(),
  city: z.string(),
  zipCode: z.string(),
});

type CreateTraining = z.infer<typeof createTrainingSchema>;

export async function createTraining(payload: CreateTraining) {
  const session = await getServerSession();
  if (!session?.user) {
    return {
      error: "not authorized",
    };
  }
  const training = createTrainingSchema.parse(payload);

  await prisma.training.create({
    data: {
      ...training,
      authorId: session?.user.id,
    },
  });

  const trainingRequests = await prisma.trainingRequest.findMany({
    where: {
      trainerId: session.user.id,
    },
    select: {
      id: true,
      user: true,
    },
  });

  const subscribedUsers = trainingRequests.map((r) => r.user.email);
  subscribedUsers.forEach((email) => {
    sendTrainingRegistrationNotificationMail({
      to: email,
      trainerName: session.user.name || "Ein:e Trainer:in",
    });
  });

  await prisma.trainingRequest.deleteMany({
    where: {
      trainerId: session.user.id,
    },
  });

  revalidatePath("/trainers/requests");
}
