"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { useMenu } from "./nav/menu-context";
import { buttonVariants } from "./ui/button";

export function SidebarLink({
  children,
  href,
  exact,
  ...props
}: React.ComponentProps<typeof Link> & { exact?: boolean }) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href.toString());

  const menu = useMenu();

  function handleClick() {
    menu?.setIsOpen(false);
  }

  return (
    <Link
      {...props}
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        isActive ? "bg-gray-100 hover:bg-gray-100" : "hover:bg-gray-50",
        "w-full justify-start whitespace-nowrap",
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
