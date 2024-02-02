"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { formatTrainingDate } from "@/lib/date";
import { getServerSession } from "@/lib/getServerSession";
import {
  sendTrainingCancelledMail,
  sendTrainingRegistrationNotificationMail,
  sendTrainingUpdatedMail,
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

  revalidatePath("/trainers");
}

export async function cancelTraining(id: string, reason: string) {
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
      reason,
    });
  });

  revalidatePath("/trainers");
}

const createTrainingSchema = z.object({
  description: z.string(),
  start: z.date(),
  end: z.date(),
  maxInterns: z.number(),
  address: z.string(),
  city: z.string(),
  zipCode: z.string(),
});

export async function createTraining(
  payload: z.infer<typeof createTrainingSchema>,
) {
  const session = await getServerSession();
  if (!session?.user) {
    return {
      error: "not authorized",
    };
  }
  const trainingData = createTrainingSchema.parse(payload);

  const training = await prisma.training.create({
    data: {
      ...trainingData,
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

const updateTrainingSchema = z.object({
  description: z.string(),
  start: z.date(),
  end: z.date(),
  address: z.string(),
  city: z.string(),
  zipCode: z.string(),
});

export async function updateTraining(
  id: string,
  payload: z.infer<typeof updateTrainingSchema>,
) {
  const session = await getServerSession();
  if (!session?.user) {
    return {
      error: "not authorized",
    };
  }
  const data = updateTrainingSchema.parse(payload);

  await prisma.training.update({
    where: {
      id,
    },
    data,
  });

  const registrations = await prisma.registration.findMany({
    where: {
      trainingId: id,
    },
    select: {
      user: true,
    },
  });

  const registeredUsers = registrations.map((r) => ({
    email: r.user.email,
    name: r.user.name,
  }));

  registeredUsers.forEach((user) => {
    sendTrainingUpdatedMail({
      to: user.email,
      trainerName: session.user.name || "Ein:e Trainer:in",
      training: data,
    });
  });

  revalidatePath("/trainings");
}
