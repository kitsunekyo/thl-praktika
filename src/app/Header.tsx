"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { Auth } from "./Auth";

const LINKS = [
  {
    href: "/trainer/dashboard",
    label: "Trainer Hub",
    roles: ["trainer", "admin"],
  },
  {
    href: "/admin/user",
    label: "Users",
    roles: ["admin"],
  },
  {
    href: "/admin/registration",
    label: "Registrations",
    roles: ["admin"],
  },
];

export function Header({ user }: { user?: Session["user"] }) {
  const pathname = usePathname();

  return (
    <header className="flex flex-wrap items-center py-6">
      <div className="spacing mr-12 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Link href="/">THL Praktika</Link>
      </div>
      <nav>
        <NavigationMenu>
          <NavigationMenuList>
            {LINKS.map((link) => {
              const isActive = pathname === link.href;
              const role = user?.role || "user";
              if (link.roles && !link.roles.includes(role)) {
                return null;
              }

              return (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive && "bg-accent/60",
                      )}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div className="ml-auto">
        <Auth user={user} />
      </div>
    </header>
  );
}
