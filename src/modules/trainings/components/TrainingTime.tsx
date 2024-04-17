"use client";

import { formatDuration, intervalToDuration } from "date-fns";

import { formatTrainingTime } from "@/lib/date";

export function TrainingTime({ start, end }: { start: Date; end: Date }) {
  const duration = formatDuration(
    intervalToDuration({ start: start, end: end }),
    {
      format: ["hours", "minutes"],
    },
  );

  return (
    <div className="flex grow items-baseline gap-2 text-xs leading-tight text-muted-foreground">
      <time dateTime={start.toLocaleDateString()}>
        {formatTrainingTime(start, end)}
      </time>
      <time dateTime={duration} className="ml-auto text-right">
        {duration}
      </time>
    </div>
  );
}
