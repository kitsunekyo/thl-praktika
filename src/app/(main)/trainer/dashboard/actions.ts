"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getFixedDate } from "@/lib/date";
import { getServerSession } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";

export async function getMyTrainings() {
  const session = await getServerSession();

  if (!session) {
    return [];
  }

  return prisma.training.findMany({
    where: {
      authorId: session.user.id,
      date: {
        gte: new Date(),
      },
    },
    include: {
      author: true,
      registrations: true,
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function deleteTraining(id: string) {
  await prisma.training.delete({
    where: {
      id,
    },
  });
  revalidatePath("/trainer");
}

const createTrainingSchema = z.object({
  description: z.string().optional(),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  maxInterns: z.number(),
  customAddress: z.boolean(),
});

export async function createTraining(
  payload: z.infer<typeof createTrainingSchema>,
) {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    return {
      error: "not authorized",
    };
  }
  const training = createTrainingSchema.parse(payload);
  await prisma.training.create({
    data: {
      ...training,
      authorId: currentUser.id,
      date: getFixedDate(training.date),
    },
  });
  revalidatePath("/");
}
