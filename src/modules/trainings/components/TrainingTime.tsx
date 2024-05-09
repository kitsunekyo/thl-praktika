"use client";

import { formatDuration, intervalToDuration } from "date-fns";
import { ClockIcon } from "lucide-react";

import { formatTrainingTime } from "@/lib/date";

export function TrainingTime({ start, end }: { start: Date; end: Date }) {
  const duration = formatDuration(
    intervalToDuration({ start: start, end: end }),
    {
      format: ["hours", "minutes"],
    },
  );

  return (
    <div className="flex grow items-center gap-2 font-medium">
      <ClockIcon className="h-4 w-4 shrink-0" />
      <time dateTime={start.toLocaleDateString()}>
        {formatTrainingTime(start, end)} ({duration})
      </time>
    </div>
  );
}
