"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session, User } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import React, { useState } from "react";

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
const ALL_LINKS = [
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

function canSeeLink(link: (typeof ALL_LINKS)[number], user?: Session["user"]) {
  return !link.roles || (user && user.role && link.roles.includes(user.role));
}

export function Header({ user }: { user?: Session["user"] }) {
  const links = ALL_LINKS.filter((link) => canSeeLink(link, user));

  return (
    <header>
      <div className="container flex flex-wrap items-center py-6">
        <div className="mr-12">
          <Logo />
        </div>
        <DesktopMenu links={links} />
        <div className="ml-auto hidden md:block">
          {!!user ? <UserMenu user={user} /> : <LoginButton />}
        </div>
        <MobileMenu user={user} links={links} />
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

function DesktopMenu({ links }: { links: typeof ALL_LINKS }) {
  const pathname = usePathname();

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
                    pathname === link.href && "bg-accent/60",
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

function MobileMenu({ user, links }: { user?: User; links: typeof ALL_LINKS }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Logo onNavigate={() => setMobileMenuOpen(false)} />
          </SheetHeader>
          <nav aria-label="Navigation">
            <ul className="space-y-2 text-sm font-semibold">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
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
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={user.image || "/img/avatar.jpg"} />
                    <AvatarFallback>{getInitials(user)}</AvatarFallback>
                  </Avatar>
                  <dl className="min-w-0 shrink truncate text-xs">
                    {!!user.name && (
                      <dd className="font-medium">{user.name}</dd>
                    )}
                    <dd className="text-gray-400">{user.email}</dd>
                  </dl>
                </div>
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

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="spacing text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-500">
      <Link href="/" className="py-2" onClick={onNavigate}>
        THL Praktika
      </Link>
    </div>
  );
}
