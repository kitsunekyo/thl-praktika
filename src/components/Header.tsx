import { User } from "@prisma/client";
import Link from "next/link";

import { Logo } from "./Logo";
import { MobileNav } from "./nav/MobileNav";
import { UserMenu } from "./nav/UserMenu";
import { Button } from "./ui/button";

export function Header({
  user,
}: {
  user?: Pick<User, "name" | "image" | "role" | "id" | "email">;
}) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[62px] flex-wrap items-center bg-white px-4 py-2 shadow md:static md:top-auto md:shadow-none">
      <div className="mr-12">
        <Logo />
      </div>
      <div className="ml-auto hidden lg:block">
        {!!user ? <UserMenu user={user} /> : <LoginButton />}
      </div>
      <MobileNav user={user} className="ml-auto pl-2 lg:hidden" />
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
