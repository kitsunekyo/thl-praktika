import { PawPrintIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  onNavigate,
  light,
}: {
  light?: boolean;
  onNavigate?: () => void;
}) {
  const source = light ? "/img/outlines-negative.svg" : "/img/outlines-red.svg";

  return (
    <div
      className={cn(
        "spacing text-xs font-bold uppercase tracking-widest hover:text-gray-500",
        { "text-white": light },
      )}
    >
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center space-x-2"
      >
        <Image
          src={source}
          alt=""
          height={40}
          width={40}
          className="text-thl"
        />
        <span>Praktika</span>
      </Link>
    </div>
  );
}
