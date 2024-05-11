import Link from "next/link";
import { Suspense } from "react";

import { getMyProfile } from "@/modules/users/queries";

import { Logo } from "./Logo";
import { MenuProvider } from "./nav/menu-context";
import { MobileMenu } from "./nav/MobileMenu";
import { UserMenu } from "./nav/UserMenu";
import { Sidebar } from "./Sidebar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex min-h-[var(--header-size)] flex-wrap items-center bg-white px-4 py-2 shadow md:static md:top-auto md:shadow-none">
      <div className="mr-12">
        <Logo />
      </div>
      <div className="ml-auto">
        <Suspense fallback={<Skeleton className="h-8 w-[150px] rounded" />}>
          <NavLoader />
        </Suspense>
      </div>
    </header>
  );
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
      <div className="hidden lg:block">
        <UserMenu user={user} />
      </div>
      <div className="lg:hidden">
        <MenuProvider>
          <MobileMenu className="pl-2" user={user}>
            <Sidebar />
          </MobileMenu>
        </MenuProvider>
      </div>
    </>
  );
}
