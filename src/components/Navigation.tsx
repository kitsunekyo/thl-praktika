"use client";

import {
  BugIcon,
  CalendarCheck2Icon,
  ContactIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  LayoutGridIcon,
  ListIcon,
  ListRestartIcon,
  MailsIcon,
  UserCircleIcon,
  Users2Icon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navigation({
  className,
  role,
  onNavigate,
}: React.HTMLAttributes<HTMLDivElement> & {
  role?: string;
  onNavigate?: () => void;
}) {
  const canRegister = role === "user" || role === "admin";
  const canCreateTrainings = role === "trainer" || role === "admin";

  return (
    <aside className={cn("relative pb-12", className)}>
      <nav className="sticky top-0 space-y-4 py-6">
        <div className="px-3">
          <div className="space-y-1">
            <SidebarLink href="/" exact onClick={onNavigate}>
              <LayoutGridIcon className="mr-2 h-4 w-4 shrink-0" />
              Praktika
            </SidebarLink>
            {canRegister && (
              <SidebarLink href="/trainings" onClick={onNavigate}>
                <CalendarCheck2Icon className="mr-2 h-4 w-4 shrink-0" />
                Meine Anmeldungen
              </SidebarLink>
            )}
            {canCreateTrainings && (
              <SidebarLink href="/trainer" exact onClick={onNavigate}>
                <GraduationCapIcon className="mr-2 h-4 w-4 shrink-0" />
                Meine Praktika
              </SidebarLink>
            )}
            {canCreateTrainings && (
              <SidebarLink href="/trainer-requests" exact onClick={onNavigate}>
                <ListIcon className="mr-2 h-4 w-4 shrink-0" />
                Praktika Anfragen
              </SidebarLink>
            )}
            <SidebarLink href="/profile" onClick={onNavigate} exact>
              <UserCircleIcon className="mr-2 h-4 w-4 shrink-0" />
              Mein Profil
            </SidebarLink>
          </div>
        </div>
        <div className="px-3">
          <Title>Personen</Title>
          <div className="space-y-1">
            <SidebarLink href="/trainers" onClick={onNavigate}>
              <ContactIcon className="mr-2 h-4 w-4 shrink-0" />
              Trainer:innen
            </SidebarLink>
            <SidebarLink href="/users" onClick={onNavigate}>
              <Users2Icon className="mr-2 h-4 w-4 shrink-0" />
              Praktikanten
            </SidebarLink>
          </div>
        </div>
        {role === "admin" && (
          <div className="px-3">
            <Title>Admin</Title>
            <div className="space-y-1">
              <SidebarLink href="/admin/users" onClick={onNavigate}>
                <UsersIcon className="mr-2 h-4 w-4 shrink-0" />
                Benutzer
              </SidebarLink>
              <SidebarLink href="/admin/invitations" onClick={onNavigate}>
                <MailsIcon className="mr-2 h-4 w-4 shrink-0" />
                Einladungen
              </SidebarLink>
            </div>
          </div>
        )}
        <div className="mt-auto px-3">
          <Title>Hilfe</Title>
          <div className="space-y-1">
            <SidebarLink
              href="mailto:hi@mostviertel.tech?subject=thl-praktika"
              onClick={onNavigate}
            >
              <BugIcon className="mr-2 h-4 w-4 shrink-0" />
              Hilfe
              <ExternalLinkIcon className="ml-2 h-4 w-4 shrink-0" />
            </SidebarLink>
            <SidebarLink href="/changelog" onClick={onNavigate}>
              <ListRestartIcon className="mr-2 h-4 w-4 shrink-0" />
              Änderungen
            </SidebarLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}

function SidebarLink({
  children,
  href,
  exact,
  ...props
}: React.ComponentProps<typeof Link> & { exact?: boolean }) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href.toString());

  return (
    <Link
      {...props}
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

function Title({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="px-4 text-xs font-medium leading-6 text-muted-foreground">
      {children}
    </div>
  );
}
