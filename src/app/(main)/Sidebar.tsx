"use client";

import {
  CalendarCheck2Icon,
  LayoutGridIcon,
  MailsIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative pb-12", className)}>
      <div className="sticky top-0 space-y-4 py-6">
        <div className="px-3">
          <div className="space-y-1">
            <SidebarLink href="/">
              <LayoutGridIcon className="mr-2 h-4 w-4" />
              Übersicht
            </SidebarLink>
            <SidebarLink href="/trainings">
              <CalendarCheck2Icon className="mr-2 h-4 w-4" />
              Anmeldungen
            </SidebarLink>
          </div>
        </div>
        <div className="px-3">
          <Title>Admin</Title>
          <div className="space-y-1">
            <SidebarLink href="/admin/users">
              <UsersIcon className="mr-2 h-4 w-4" />
              Benutzer
            </SidebarLink>
            <SidebarLink href="/admin/invitations">
              <MailsIcon className="mr-2 h-4 w-4" />
              Einladungen
            </SidebarLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  children,
  href,
  ...props
}: React.ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const isRootLink = href === "/";

  const isActive = isRootLink
    ? pathname === href
    : pathname.startsWith(href.toString());

  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        isActive
          ? "bg-muted hover:bg-muted"
          : "hover:bg-transparent hover:underline",
        "w-full justify-start whitespace-nowrap",
      )}
      href={href}
    >
      {children}
    </Link>
  );
}

function Title({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
      {children}
    </h2>
  );
}
