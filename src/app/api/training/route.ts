import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export const createTrainingSchema = z.object({
  description: z.string().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  maxInterns: z.number().default(3),
});

export async function PUT(request: NextRequest) {
  const client = new PrismaClient();
  const data = await request.json();
  const training = createTrainingSchema.parse(data);
  const res = await client.training.create({ data: training });
  return NextResponse.json(res);
}
