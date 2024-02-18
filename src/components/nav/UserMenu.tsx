"use client";

import { User } from "@prisma/client";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/modules/users/name";

export const USER_NAV_LINKS = [
  {
    href: "/profile",
    label: "Profil",
  },
];

export function UserMenu({ user }: { user: Pick<User, "name" | "image"> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded focus:outline-none">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image || "/img/avatar.jpg"} />
            <AvatarFallback>{getInitials(user)}</AvatarFallback>
          </Avatar>
          {user.name && (
            <span className="min-w-0 max-w-[160px] shrink truncate text-xs font-medium">
              {user.name}
            </span>
          )}
          <ChevronDownIcon className="hidden h-4 w-4 lg:block" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]">
        {USER_NAV_LINKS.map(({ href, label }) => (
          <DropdownMenuItem key={href}>
            <Link href={href} className="w-full">
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button onClick={() => signOut()} className="flex items-center gap-2">
            <LogOutIcon className="h-4 w-4" /> Abmelden
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
