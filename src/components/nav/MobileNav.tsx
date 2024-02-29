"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { Navigation } from "@/components/Navigation";
import { SafeUser } from "@/lib/prisma";
import { getInitials } from "@/modules/users/name";

import { Logo } from "../Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

export function MobileNav({
  user,
  className,
}: React.HTMLAttributes<HTMLDivElement> & {
  user?: SafeUser;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = user?.role;

  function close() {
    setMobileMenuOpen(false);
  }

  return (
    <div className={className}>
      <Sheet open={mobileMenuOpen} onOpenChange={(v) => setMobileMenuOpen(v)}>
        <SheetTrigger asChild>
          <Button type="button" variant="ghost" size="icon">
            <span className="sr-only">Navigation öffnen</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader className="my-8 text-left">
            <Logo onNavigate={close} />
          </SheetHeader>
          <div className="-ml-6 -mr-6 overflow-y-auto">
            <Navigation
              role={role}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </div>
          <div className="mt-auto">
            <hr className="py-2" />
            {!!user && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2"
                  onClick={close}
                >
                  <Avatar>
                    <AvatarImage src={user.image || "/img/avatar.jpg"} />
                    <AvatarFallback>{getInitials(user)}</AvatarFallback>
                  </Avatar>
                  <dl className="min-w-0 shrink text-xs">
                    {!!user.name && (
                      <dd className="truncate font-medium">{user.name}</dd>
                    )}
                    <dd className="truncate text-gray-400">{user.email}</dd>
                  </dl>
                </Link>
                <Button
                  onClick={() => signOut()}
                  className="mt-4 w-full"
                  size="sm"
                  variant="secondary"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" /> Abmelden
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
