import {
  CalendarCheckIcon,
  CalendarIcon,
  ContactIcon,
  LayoutGridIcon,
  SettingsIcon,
  Users2Icon,
} from "lucide-react";
import { Suspense } from "react";

import { getMyTeams, getTeam } from "@/modules/teams/queries";
import { getMyProfile } from "@/modules/users/queries";

import { AppInfoStack } from "./AppInfoStack";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Body, HeaderNavigation, Main } from "./layouts";
import { MenuProvider } from "./nav/menu-context";
import { MobileMenu } from "./nav/MobileMenu";
import {
  AdminSidebarSection,
  AppSidebarSection,
  Sidebar,
  SidebarSection,
} from "./Sidebar";
import { SidebarLink } from "./SidebarLink";
import { TeamPicker } from "./TeamPicker";

export async function TeamLayout({
  children,
  teamId,
}: {
  children?: React.ReactNode;
  teamId: string;
}) {
  const team = await getTeam(teamId);

  if (!team) {
    return null;
  }

  return (
    <>
      <AppInfoStack />
      <Header>
        <TeamPickerLoader />
        <HeaderNavigation />
        <MobileMenuLoader teamId={teamId} />
      </Header>
      <Body className="lg:grid-cols-5">
        <Sidebar className="hidden lg:block">
          <Suspense>
            <TeamSidebarSection teamId={teamId} />
            <AdminSidebarSection />
          </Suspense>
        </Sidebar>
        <div className="col-span-3 flex min-w-0 flex-col lg:col-span-4 lg:border-l">
          <Main>{children}</Main>
          <Footer />
        </div>
        <AppInfoStack />
      </Body>
    </>
  );
}

async function TeamPickerLoader() {
  const teams = await getMyTeams();
  if (teams.length <= 0) {
    return null;
  }

  return <TeamPicker teams={teams} />;
}

async function TeamSidebarSection({ teamId }: { teamId: string }) {
  const team = await getTeam(teamId);

  if (!team) {
    return null;
  }

  return (
    <SidebarSection title={team.name}>
      <SidebarLink href={`/teams/${teamId}/`} exact>
        <LayoutGridIcon className="mr-2 h-4 w-4 shrink-0" />
        Praktika
      </SidebarLink>
      <SidebarLink href={`/teams/${teamId}/trainings`}>
        <CalendarCheckIcon className="mr-2 h-4 w-4 shrink-0" />
        Meine Anmeldungen
      </SidebarLink>
      <SidebarLink href={`/teams/${teamId}/trainer`} exact>
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        Praktika verwalten
      </SidebarLink>
      <SidebarLink href={`/teams/${teamId}/trainers`}>
        <ContactIcon className="mr-2 h-4 w-4 shrink-0" />
        Trainer:innen
      </SidebarLink>
      <SidebarLink href={`/teams/${teamId}/users`}>
        <Users2Icon className="mr-2 h-4 w-4 shrink-0" />
        Praktikanten
      </SidebarLink>
      <SidebarLink href={`/teams/${teamId}/settings`}>
        <SettingsIcon className="mr-2 h-4 w-4 shrink-0" />
        Einstellungen
      </SidebarLink>
    </SidebarSection>
  );
}

async function MobileMenuLoader({ teamId }: { teamId: string }) {
  const user = await getMyProfile();

  return (
    <div className="ml-auto lg:hidden">
      <MenuProvider>
        <MobileMenu user={user}>
          <Sidebar>
            <TeamSidebarSection teamId={teamId} />
            <AppSidebarSection />
          </Sidebar>
        </MobileMenu>
      </MenuProvider>
    </div>
  );
}
