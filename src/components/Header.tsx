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
    <header className="flex min-h-[62px] flex-wrap items-center px-4 py-2">
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
