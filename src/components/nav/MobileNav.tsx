"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { Sidebar } from "@/app/(main)/Sidebar";
import { cn, getInitials } from "@/lib/utils";

import { PRIMARY_NAV_LINKS, USER_NAV_LINKS, canSeeLink } from "./links";
import { Logo } from "../Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

const MOBILE_NAV_LINKS = [...PRIMARY_NAV_LINKS, ...USER_NAV_LINKS];

export function MobileNav({
  user,
  className,
}: React.HTMLAttributes<HTMLDivElement> & { user?: User }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = MOBILE_NAV_LINKS.filter((link) => canSeeLink(link, user));

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
          <div className="-ml-6 -mr-6">
            <Sidebar />
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
