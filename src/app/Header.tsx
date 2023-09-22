"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session, User } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import React, { useState } from "react";

import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, getInitials } from "@/lib/utils";

import { UserMenu } from "./UserMenu";

/**
 * leave roles undefined if the link should be visible for all users
 * otherwise specify the roles that should see the link
 */
const DESKTOP_LINKS = [
  {
    href: "/trainer/dashboard",
    label: "Trainer Hub",
    roles: ["trainer", "admin"],
  },
  {
    href: "/admin/user",
    label: "User",
    roles: ["admin"],
  },
  {
    href: "/admin/registration",
    label: "Anmeldungen",
    roles: ["admin"],
  },
];

const MOBILE_LINKS = [
  ...DESKTOP_LINKS,
  {
    href: "/profile",
    label: "Mein Profil",
  },
];

function canSeeLink(
  link: { href: string; label: string; roles?: string[] },
  user?: Session["user"],
) {
  return !link.roles || (user && user.role && link.roles.includes(user.role));
}

export function Header({ user }: { user?: Session["user"] }) {
  return (
    <header className="border-b">
      <div className="container flex flex-wrap items-center py-2">
        <div className="mr-12">
          <Logo />
        </div>
        <DesktopMenu user={user} />
        <div className="ml-auto hidden md:block">
          {!!user ? <UserMenu user={user} /> : <LoginButton />}
        </div>
        <MobileMenu user={user} />
      </div>
    </header>
  );
}

function LoginButton() {
  return (
    <Button onClick={() => signIn()} size="sm">
      Anmelden
    </Button>
  );
}

function DesktopMenu({ user }: { user?: User }) {
  const pathname = usePathname();
  const links = DESKTOP_LINKS.filter((link) => canSeeLink(link, user));

  return (
    <nav className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          {links.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-foreground/60 hover:text-foreground/80",
                    pathname === link.href && "text-foreground",
                  )}
                >
                  {link.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

function MobileMenu({ user }: { user?: User }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = MOBILE_LINKS.filter((link) => canSeeLink(link, user));

  function close() {
    setMobileMenuOpen(false);
  }

  return (
    <div className="ml-auto flex pl-2 md:hidden">
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
          <nav aria-label="Navigation">
            <ul className="space-y-2 text-sm font-semibold">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className={cn(
                      "-mx-4 block rounded px-4 py-3 hover:bg-accent/60",
                      pathname === link.href && "bg-accent/60",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
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
