"use client";
import { formatTrainingDate } from "@/lib/date";

export function TrainingDate({ start, end }: { start: Date; end: Date }) {
  return formatTrainingDate(start, end);
}
