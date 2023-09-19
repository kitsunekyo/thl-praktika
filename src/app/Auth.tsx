"use client";

import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

export function Auth({ user }: { user?: Session["user"] }) {
  return (
    <div className="flex items-center gap-4">
      {!!user ? <LoggedIn user={user} /> : <LoggedOut />}
    </div>
  );
}

function LoggedOut() {
  return (
    <Button onClick={() => signIn()} size="sm">
      Anmelden
    </Button>
  );
}

function LoggedIn({ user }: { user: Session["user"] }) {
  return <User user={user} />;
}

function User({ user }: { user: Session["user"] }) {
  const initials = getInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="group flex items-center">
          {!!user.role && user.role !== "user" && (
            <Badge variant="outline" className="z-10 translate-x-2 bg-white">
              {user.role}
            </Badge>
          )}
          <Avatar>
            <AvatarImage src={user.image || "/img/avatar.jpg"} />
            <AvatarFallback>{initials}</AvatarFallback>
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
