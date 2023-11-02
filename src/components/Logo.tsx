import { PawPrintIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  onNavigate,
  light,
}: {
  light?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={cn(
        "spacing text-xs font-bold uppercase tracking-widest hover:text-gray-500",
        { "text-white": light },
      )}
    >
      <Link href="/" onClick={onNavigate}>
        <div className="flex items-center space-x-2">
          <PawPrintIcon className="h-6 w-6 text-thl" />
          <span>Praktika</span>
        </div>
      </Link>
    </div>
  );
}
