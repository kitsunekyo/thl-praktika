"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { authOptions } from "./api/auth/[...nextauth]/route";

const createTrainingSchema = z.object({
  description: z.string().optional(),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  maxInterns: z.number(),
});

export async function createTraining(
  payload: z.infer<typeof createTrainingSchema>
) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }
  const training = createTrainingSchema.parse(payload);
  const client = new PrismaClient();
  await client.training.create({
    data: { ...training, authorId: currentUser.id },
  });
  revalidatePath("/");
}

export async function deleteTraining(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("No id provided");
  }
  const client = new PrismaClient();
  await client.training.delete({
    where: {
      id,
    },
  });
  revalidatePath("/");
}

export async function register(formData: FormData) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }

  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("No id provided");
  }

  const client = new PrismaClient();

  const isRegisteredAlready =
    (await client.registration.findFirst({
      where: {
        userId: currentUser.id,
      },
    })) !== null;

  if (isRegisteredAlready) {
    throw new Error("Already registered");
  }

  await client.registration.create({
    data: {
      trainingId: id,
      userId: currentUser.id,
    },
  });
  revalidatePath("/");
}

export async function unregister(formData: FormData) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }

  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("No id provided");
  }

  const client = new PrismaClient();
  const registration = await client.registration.findFirst({
    where: {
      trainingId: id,
      userId: currentUser.id,
    },
  });

  if (!registration) {
    throw new Error("Did not find registration");
  }

  await client.registration.delete({
    where: {
      id: registration.id,
    },
  });

  revalidatePath("/");
}
