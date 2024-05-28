import { formatDuration } from "date-fns";
import { MapPinIcon } from "lucide-react";

import { wrapLinksWithTags } from "@/lib/content";
import { secondsToDuration } from "@/lib/date";

export function TrainingLocation({
  address,
  traveltime,
}: {
  address: string;
  traveltime?: number;
}) {
  return (
    <div className="flex gap-2 font-medium leading-tight">
      <MapPinIcon className="h-4 w-4 shrink-0" />
      <div className="min-w-0 grow overflow-x-hidden">
        {wrapLinksWithTags(address)}
        {!!traveltime && (
          <p className="text-xs font-normal">
            {formatDuration(secondsToDuration(traveltime), {
              format: ["hours", "minutes"],
            })}{" "}
            entfernt
          </p>
        )}
      </div>
    </div>
  );
}
