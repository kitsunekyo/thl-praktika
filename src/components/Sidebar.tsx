import {
  CalendarCheck2Icon,
  GraduationCapIcon,
  HelpCircleIcon,
  LayoutGridIcon,
  ListIcon,
  MailsIcon,
  RefreshCwIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { getMyProfile } from "@/modules/users/queries";

import { SidebarLink } from "./SidebarLink";

export async function Sidebar({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <aside className={cn("relative h-full bg-white", className)}>
      <nav className="flex min-h-full flex-col py-6 md:sticky md:top-[--header-size] md:min-h-[calc(100vh-var(--header-size))]">
        <div className="grow space-y-4">{children}</div>
      </nav>
    </aside>
  );
}

export function AppSidebarSection() {
  return (
    <SidebarSection title="App">
      <SidebarLink href="/help" exact>
        <HelpCircleIcon className="mr-2 h-4 w-4 shrink-0" />
        Hilfe
      </SidebarLink>
      <SidebarLink href="/changelog" exact>
        <RefreshCwIcon className="mr-2 h-4 w-4 shrink-0" />
        Änderungen
      </SidebarLink>
    </SidebarSection>
  );
}

export async function AdminSidebarSection() {
  const user = await getMyProfile();
  const role = user?.role;
  const isAdmin = role === "admin";

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarSection title="Admin" className="px-3 text-red-600">
      <SidebarLink href="/admin/users">
        <UsersIcon className="mr-2 h-4 w-4 shrink-0" />
        Benutzer
      </SidebarLink>
      <SidebarLink href="/admin/invitations">
        <MailsIcon className="mr-2 h-4 w-4 shrink-0" />
        Einladungen
      </SidebarLink>
    </SidebarSection>
  );
}

export async function UserSection() {
  const user = await getMyProfile();
  const role = user?.role;
  const canRegister = role === "user" || role === "admin";
  const canCreateTrainings = role === "trainer" || role === "admin";

  return (
    <SidebarSection>
      <SidebarLink href="/" exact>
        <LayoutGridIcon className="mr-2 h-4 w-4 shrink-0" />
        Praktika Übersicht
      </SidebarLink>
      {canRegister && (
        <SidebarLink href="/trainings">
          <CalendarCheck2Icon className="mr-2 h-4 w-4 shrink-0" />
          Meine Anmeldungen
        </SidebarLink>
      )}
      {canCreateTrainings && (
        <SidebarLink href="/trainer" exact>
          <GraduationCapIcon className="mr-2 h-4 w-4 shrink-0" />
          Meine Praktika
        </SidebarLink>
      )}
      {canCreateTrainings && (
        <SidebarLink href="/trainer/requests" exact>
          <ListIcon className="mr-2 h-4 w-4 shrink-0" />
          Praktika Anfragen
        </SidebarLink>
      )}
    </SidebarSection>
  );
}

export function SidebarSection({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div className={cn("px-3", className)}>
      {!!title && (
        <div className="px-4 text-xs font-medium leading-6 text-muted-foreground">
          {title}
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}
