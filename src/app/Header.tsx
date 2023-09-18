"use client";

import Link from "next/link";
import React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const LINKS = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "trainer/dashboard",
    label: "Trainer Hub",
  },
  {
    href: "/user",
    label: "User Management",
  },
];

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex items-center py-6">
      <div className="mr-12 text-sm font-bold uppercase text-gray-400">
        <Link href="/">THL Praktika</Link>
      </div>
      <nav>
        <NavigationMenu>
          <NavigationMenuList>
            {LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link href={link.href}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div className="ml-auto">{children}</div>
    </header>
  );
}
