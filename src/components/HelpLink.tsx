import { InformationCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

export function HelpLink({
  children = "Wie funktionierts?",
  href,
}: {
  children?: ReactNode;
  href: ComponentPropsWithoutRef<typeof Link>["href"];
}) {
  return (
    <div className="flex items-center gap-1 text-blue-500">
      <InformationCircleIcon className="size-4 " />
      <Link href={href} className="hover:underline" target="_blank">
        {children}
      </Link>
    </div>
  );
}
