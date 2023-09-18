"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { authOptions, getSession } from "../api/auth/[...nextauth]/route";

export async function getMyTrainings() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return [];
  }

  return prisma.training.findMany({
    where: {
      authorId: session.user.id,
    },
    include: {
      author: true,
      registrations: true,
    },
  });
}

export async function deleteTraining(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("No id provided");
  }
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
});

export async function createTraining(
  payload: z.infer<typeof createTrainingSchema>,
) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }
  const training = createTrainingSchema.parse(payload);
  await prisma.training.create({
    data: { ...training, authorId: currentUser.id },
  });
  revalidatePath("/");
}
