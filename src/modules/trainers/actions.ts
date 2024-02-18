"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { formatTrainingDate } from "@/lib/date";
import { AuthenticationError } from "@/lib/errors";
import {
  sendTrainingCancelledMail,
  sendTrainingRegistrationNotificationMail,
  sendTrainingRequestReceivedMail,
  sendTrainingUpdatedMail,
} from "@/lib/postmark";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/getServerSession";

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
  await prisma.training.create({
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
    throw new AuthenticationError();
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

export async function deleteTrainingRequest(id: string) {
  await prisma.trainingRequest.delete({
    where: {
      id,
    },
  });

  revalidatePath("/trainers/requests");
}
