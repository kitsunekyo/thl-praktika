import { UserCheckIcon, UserIcon } from "lucide-react";

import { range } from "@/lib/utils";

import { Badge } from "../ui/badge";

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
        <Badge className="ml-2" variant="outline">
          {count}/{max} angemeldet
        </Badge>
      ) : (
        <Badge className="ml-2" variant="secondary">
          voll
        </Badge>
      )}
    </div>
  );
}
