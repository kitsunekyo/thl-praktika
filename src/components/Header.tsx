import Link from "next/link";
import { Session } from "next-auth";

import { Logo } from "./Logo";
import { DesktopNav } from "./nav/DesktopNav";
import { MobileNav } from "./nav/MobileNav";
import { UserMenu } from "./nav/UserMenu";
import { Button } from "./ui/button";

export function Header({ user }: { user?: Session["user"] }) {
  return (
    <header className="border-b">
      <div className="container flex min-h-[60px] flex-wrap items-center py-2">
        <div className="mr-12">
          <Logo />
        </div>
        <DesktopNav user={user} />
        <div className="ml-auto hidden md:block">
          {!!user ? <UserMenu user={user} /> : <LoginButton />}
        </div>
        <MobileNav user={user} />
      </div>
    </header>
  );
}

function LoginButton() {
  return (
    <Link href="/login">
      <Button size="sm" variant="link">
        Anmelden
      </Button>
    </Link>
  );
}
