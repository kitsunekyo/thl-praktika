"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
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

export function Header({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") return null;

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
              const role = session?.user.role || "user";
              if (link.roles && !link.roles.includes(role)) {
                return null;
              }

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
