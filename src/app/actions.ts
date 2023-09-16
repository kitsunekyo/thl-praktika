"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import * as z from "zod";

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
  const training = createTrainingSchema.parse(payload);
  const client = new PrismaClient();
  await client.training.create({
    data: training,
  });
  revalidatePath("/");
}
