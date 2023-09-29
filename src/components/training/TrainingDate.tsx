import { formatDuration, intervalToDuration } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
      <span>{formatTrainingDate(start, end)}</span>
      <span className="ml-auto text-xs text-muted-foreground">{duration}</span>
    </div>
  );
}
