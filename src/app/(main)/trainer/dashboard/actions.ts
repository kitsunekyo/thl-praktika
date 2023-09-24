"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

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
      start: {
        gte: new Date(),
      },
    },
    include: {
      author: true,
      registrations: true,
    },
    orderBy: {
      start: "asc",
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
  start: z.date(),
  end: z.date(),
  maxInterns: z.number(),
  customAddress: z.boolean(),
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
  revalidatePath("/");
}
