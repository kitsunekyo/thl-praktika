import { UserCheckIcon, UserIcon } from "lucide-react";

import { range } from "@/lib/utils";

export function TrainingRegistrations({
  count,
  max,
}: {
  count: number;
  max: number;
}) {
  const freeSpots = max - count;

  return (
    <div className="flex items-center">
      {range(count).map((i) => (
        <UserCheckIcon key={i} className="h-5 w-5" />
      ))}
      {range(freeSpots).map((i) => (
        <UserIcon key={i} className="h-5 w-5 text-gray-400" />
      ))}
      {freeSpots > 0 ? (
        <span className="ml-2 text-xs">
          {count}/{max} Anmeldungen
        </span>
      ) : (
        <span className="ml-2 text-xs">voll</span>
      )}
    </div>
  );
}
