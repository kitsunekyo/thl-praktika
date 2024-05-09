"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { SafeUser } from "@/lib/prisma";
import { getInitials } from "@/modules/users/name";

import { useMenu } from "./menu-context";
import { Logo } from "../Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

export function MobileMenu({
  user,
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  user: Pick<SafeUser, "name" | "email" | "image">;
}) {
  const menu = useMenu();

  if (!menu) {
    throw new Error("MobileMenu must be wrapped with MenuProvider");
  }

  function close() {
    menu?.setIsOpen(false);
  }

  return (
    <div className={className}>
      <Sheet open={menu.isOpen} onOpenChange={(v) => menu.setIsOpen(v)}>
        <SheetTrigger asChild>
          <Button type="button" variant="ghost" size="icon">
            <span className="sr-only">Navigation öffnen</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader className="text-left">
            <Logo onNavigate={close} />
          </SheetHeader>
          <div className="-ml-6 -mr-6 overflow-y-auto">{children}</div>
          <footer className="mt-auto border-t pt-4">
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
                  <div className="min-w-0 shrink text-xs">
                    {!!user.name && (
                      <div className="truncate font-medium">{user.name}</div>
                    )}
                    <div className="truncate text-gray-400">{user.email}</div>
                  </div>
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
          </footer>
        </SheetContent>
      </Sheet>
    </div>
  );
}
