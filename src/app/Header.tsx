"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const LINKS = [
  {
    href: "/trainer/dashboard",
    label: "Trainer Hub",
  },
  {
    href: "/admin/user",
    label: "Users",
  },
  {
    href: "/admin/registration",
    label: "Registrations",
  },
];

export function Header({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <header className="flex items-center py-6">
      <div className="spacing mr-12 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Link href="/">THL Praktika</Link>
      </div>
      <nav>
        <NavigationMenu>
          <NavigationMenuList>
            {LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href}>
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

      <div className="ml-auto">{children}</div>
    </header>
  );
}
