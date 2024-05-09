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
import { Suspense } from "react";

import { cn } from "@/lib/utils";
import { getMyProfile } from "@/modules/users/queries";

import { SidebarLink } from "./SidebarLink";
import { Skeleton } from "./ui/skeleton";

export async function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("relative pb-12", className)}>
      <nav className="sticky top-0 space-y-4 py-6">
        <Suspense fallback={<SectionLoading />}>
          <AdminSection />
        </Suspense>
        <Suspense fallback={<SectionLoading />}>
          <UserSection />
        </Suspense>
        <div className="px-3">
          <Title>Personen</Title>
          <div className="space-y-1">
            <SidebarLink href="/profile" exact>
              <UserCircleIcon className="mr-2 h-4 w-4 shrink-0" />
              Mein Profil
            </SidebarLink>
            <SidebarLink href="/trainers">
              <ContactIcon className="mr-2 h-4 w-4 shrink-0" />
              Trainer:innen
            </SidebarLink>
            <SidebarLink href="/users">
              <Users2Icon className="mr-2 h-4 w-4 shrink-0" />
              Praktikanten
            </SidebarLink>
          </div>
        </div>
        <div className="mt-auto px-3">
          <Title>Hilfe</Title>
          <div className="space-y-1">
            <SidebarLink href="mailto:hi@mostviertel.tech?subject=thl-praktika">
              <BugIcon className="mr-2 h-4 w-4 shrink-0" />
              Hilfe
              <ExternalLinkIcon className="ml-2 h-4 w-4 shrink-0" />
            </SidebarLink>
            <SidebarLink href="/changelog">
              <ListRestartIcon className="mr-2 h-4 w-4 shrink-0" />
              Änderungen
            </SidebarLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}

async function AdminSection() {
  const user = await getMyProfile();
  const role = user?.role;
  const isAdmin = role === "admin";

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="px-3">
      <Title>Admin</Title>
      <div className="space-y-1">
        <SidebarLink href="/admin/users">
          <UsersIcon className="mr-2 h-4 w-4 shrink-0" />
          Benutzer
        </SidebarLink>
        <SidebarLink href="/admin/invitations">
          <MailsIcon className="mr-2 h-4 w-4 shrink-0" />
          Einladungen
        </SidebarLink>
      </div>
    </div>
  );
}

async function UserSection() {
  const user = await getMyProfile();
  const role = user?.role;
  const canRegister = role === "user" || role === "admin";
  const canCreateTrainings = role === "trainer" || role === "admin";

  return (
    <div className="px-3">
      <div className="space-y-1">
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
      </div>
    </div>
  );
}

function Title({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="px-4 text-xs font-medium leading-6 text-muted-foreground">
      {children}
    </div>
  );
}

function SectionLoading() {
  return (
    <div className="px-3">
      <Skeleton className="mb-2 h-6 w-24 rounded" />
      <div className="space-y-1">
        <Skeleton className="h-8 rounded" />
        <Skeleton className="h-8 rounded" />
        <Skeleton className="h-8 rounded" />
      </div>
    </div>
  );
}
