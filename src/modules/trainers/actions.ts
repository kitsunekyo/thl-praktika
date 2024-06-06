"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { formatTrainingDate } from "@/lib/date";
import { AuthenticationError } from "@/lib/errors";
import { sendMail } from "@/lib/mail";
import { prisma, selectPublicUser } from "@/lib/prisma";

import { getServerSession } from "../auth/next-auth";

export async function deleteTraining(id: string) {
  const session = await getServerSession();
  if (!session?.user) {
    return { error: "not authenticated" };
  }
  const training = await prisma.training.findFirst({
    where: {
      id,
      authorId: session.user.id,
    },
    include: {
      author: {
        select: selectPublicUser,
      },
      registrations: {
        include: {
          user: {
            select: selectPublicUser,
          },
        },
      },
    },
  });

  if (!training) {
    return { error: "training not found" };
  }
  if (training.registrations.length > 0) {
    return { error: "training has registrations" };
  }

  await prisma.training.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  revalidatePath("/trainers");
}

export async function cancelTraining(id: string, reason: string) {
  const session = await getServerSession();
  if (!session?.user) {
    return { error: "not authenticated" };
  }

  const training = await prisma.training.findFirst({
    where: {
      id,
      authorId: session.user.id,
    },
    include: {
      author: {
        select: selectPublicUser,
      },
      registrations: {
        include: {
          user: {
            select: selectPublicUser,
          },
        },
      },
    },
  });

  if (!training) {
    return { error: "training not found" };
  }

  await prisma.training.update({
    where: {
      id,
    },
    data: {
      cancelledAt: new Date(),
    },
  });

  const registeredUsers = training.registrations.map((r) => r.user.email);
  registeredUsers.forEach((email) => {
    sendMail({
      to: email,
      templateName: "training-cancelled",
      data: {
        trainer_name: training.author.name,
        date: formatTrainingDate(training.start, training.end),
        reason,
      },
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
});

export async function createTraining(
  payload: z.infer<typeof createTrainingSchema>,
) {
  const session = await getServerSession();
  if (!session?.user) {
    return { error: "not authenticated" };
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
      user: {
        select: selectPublicUser,
      },
    },
  });

  const subscribedUsers = trainingRequests.map((r) => r.user.email);
  subscribedUsers.forEach((email) => {
    sendMail({
      templateName: "training-created",
      to: email,
      data: {
        trainer_name: session.user.name,
      },
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
      user: {
        select: selectPublicUser,
      },
    },
  });

  const registeredUsers = registrations.map((r) => ({
    email: r.user.email,
    name: r.user.name,
  }));

  registeredUsers.forEach((user) => {
    sendMail({
      to: user.email,
      templateName: "training-updated",
      data: {
        trainer_name: session.user.name,
        date: formatTrainingDate(data.start, data.end),
        description: data.description || "",
        address: data.address || "",
      },
    });
  });

  revalidatePath("/trainings");
}
export async function createTrainingRequest({
  trainerId,
  message,
}: {
  trainerId: string;
  message?: string;
}) {
  const session = await getServerSession();
  if (!session?.user) {
    return { error: "not authenticated" };
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: session.user.id,
    },
    select: selectPublicUser,
  });

  const existingRequest = await prisma.trainingRequest.findFirst({
    where: {
      userId: user.id,
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
      userId: user.id,
      trainerId,
      message,
    },
  });

  await sendMail({
    templateName: "training-request",
    to: trainer.email,
    replyTo: user.email,
    data: {
      user_name: user.name,
      user_email: user.email,
      user_phone: user.phone,
      message,
    },
  });

  revalidatePath(`/profile/${trainerId}`);
  revalidatePath("/trainers/requests");
}

export async function deleteTrainingRequest(id: string) {
  const session = await getServerSession();
  if (!session?.user) {
    return { error: "not authenticated" };
  }
  await prisma.trainingRequest.delete({
    where: {
      id,
    },
  });

  revalidatePath("/trainers/requests");
}
