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
    <div className="flex gap-2 font-medium leading-tight">
      <ClockIcon className="h-4 w-4 shrink-0" />
      <div className="space-y-1">
        <time dateTime={start.toLocaleDateString()} className="font-medium">
          {formatTrainingTime(start, end)}
        </time>
        <p className="text-xs font-normal">{duration}</p>
      </div>
    </div>
  );
}
