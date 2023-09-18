"use client";

import { LogOutIcon } from "lucide-react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

export function Auth({ user }: { user?: Session["user"] }) {
  return (
    <header className="flex items-center gap-4">
      {!!user ? <LoggedIn user={user} /> : <LoggedOut />}
    </header>
  );
}

function LoggedOut() {
  return <Button onClick={() => signIn()}>Login</Button>;
}

function LoggedIn({ user }: { user: Session["user"] }) {
  return (
    <>
      {!!user && <User user={user} />}
      <Button onClick={() => signOut()} size="icon" variant="secondary">
        <LogOutIcon className="h-4 w-4" />
      </Button>
    </>
  );
}

function User({ user }: { user: Session["user"] }) {
  const initials = getInitials(user);

  return (
    <div className="flex items-end">
      {!!user.role && user.role !== "user" && (
        <Badge variant="outline" className="z-10 translate-x-2 bg-white">
          {user.role}
        </Badge>
      )}
      <Avatar>
        <AvatarImage src={user.image || "/img/avatar.jpg"} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </div>
  );
}
