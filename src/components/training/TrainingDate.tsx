import { formatDuration, intervalToDuration } from "date-fns";

import { formatTrainingDate } from "@/lib/date";

export function TrainingDate({ start, end }: { start: Date; end: Date }) {
  const duration = formatDuration(
    intervalToDuration({ start: start, end: end }),
    {
      format: ["hours", "minutes"],
    },
  );
  return (
    <div className="flex w-full items-center">
      <span>{formatTrainingDate(start, end)}</span>
      <span className="ml-auto text-xs text-muted-foreground">{duration}</span>
    </div>
  );
}
