import { formatDuration } from "date-fns";
import { ExternalLinkIcon, MapPinIcon } from "lucide-react";

import { secondsToDuration } from "@/lib/date";

export function TrainingLocation({
  address,
  traveltime,
}: {
  address: string;
  traveltime?: number;
}) {
  let parts = address.split(/(https:\/\/maps.app.goo.gl\/\w*)/gi);
  const addressContent = parts.filter(Boolean).map((p, i) => {
    if (p.match(/(https:\/\/maps.app.goo.gl\/\w*)/gi)) {
      return (
        <a
          key={p + i}
          href={p}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline"
        >
          Google maps
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      );
    }
    return p;
  });

  return (
    <div className="flex gap-2 font-medium leading-tight">
      <MapPinIcon className="h-4 w-4 shrink-0" />
      <div className="space-y-1 break-words">
        {addressContent}
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
