import { formatDuration, intervalToDuration } from "date-fns";

import { formatTrainingDate } from "@/lib/date";

export function TrainingDate({ start, end }: { start: Date; end: Date }) {
  const duration = formatDuration(
    intervalToDuration({ start: start, end: end }),
    {
      format: ["hours", "minutes"],
    },
  );

  return `${formatTrainingDate(start, end)} (${duration})`;
}
