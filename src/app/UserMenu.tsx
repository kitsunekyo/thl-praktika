"use client";

import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

export function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="group flex items-center">
          <Avatar>
            <AvatarImage src={user.image || "/img/avatar.jpg"} />
            <AvatarFallback>{getInitials(user)}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon className="ml-2 hidden h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 lg:block" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]">
        <DropdownMenuItem>
          <Link href="/profile" className="w-full">
            Mein Profil
          </Link>
        </DropdownMenuItem>
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
