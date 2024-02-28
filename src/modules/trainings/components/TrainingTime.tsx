"use client";

import { formatTrainingTime } from "@/lib/date";

export function TrainingTime({ start, end }: { start: Date; end: Date }) {
  return formatTrainingTime(start, end);
}
