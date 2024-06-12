import Link from "next/link";
import { Suspense } from "react";

import { getMyTeams } from "@/modules/teams/queries";
import { getMyProfile } from "@/modules/users/queries";

import { Logo } from "./Logo";
import { MenuProvider } from "./nav/menu-context";
import { MobileMenu } from "./nav/MobileMenu";
import { UserMenu } from "./nav/UserMenu";
import { Sidebar } from "./Sidebar";
import { TeamPicker } from "./TeamPicker";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex min-h-[var(--header-size)] items-center gap-2 bg-white px-4 py-2 shadow md:static md:top-auto md:shadow-none">
      <Logo />
      <Teams />
      <div className="ml-auto">
        <Suspense fallback={<Skeleton className="h-8 w-[150px] rounded" />}>
          <NavLoader />
        </Suspense>
      </div>
    </header>
  );
}

async function Teams() {
  const teams = await getMyTeams();

  return <TeamPicker teams={teams} />;
}

async function NavLoader() {
  const user = await getMyProfile();

  if (!user) {
    return (
      <Link href="/login">
        <Button size="sm" variant="link">
          Anmelden
        </Button>
      </Link>
    );
  }

  return (
    <>
      <div className="hidden leading-[0] lg:block">
        <UserMenu user={user} />
      </div>
      <div className="lg:hidden">
        <MenuProvider>
          <MobileMenu user={user}>
            <Sidebar />
          </MobileMenu>
        </MenuProvider>
      </div>
    </>
  );
}
