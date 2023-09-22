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
      <Link href="/" className="py-2" onClick={onNavigate}>
        THL Praktika
      </Link>
    </div>
  );
}
