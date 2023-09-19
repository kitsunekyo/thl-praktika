"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import React, { useState } from "react";

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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { Auth } from "./Auth";

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
  const pathname = usePathname();
  const links = ALL_LINKS.filter((link) => canSeeLink(link, user));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="flex flex-wrap items-center py-6">
      <div className="mr-12">
        <Logo />
      </div>

      <nav className="hidden lg:block">
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

      <div className="ml-auto">
        <Auth user={user} />
      </div>

      <div className="ml-2 flex lg:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={(v) => setMobileMenuOpen(v)}>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <span className="sr-only">Navigation öffnen</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent>
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
          </SheetContent>
        </Sheet>
      </div>
    </header>
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
