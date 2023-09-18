"use client";

import { LogOutIcon } from "lucide-react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AuthHeader({ session }: { session: Session | null }) {
  return (
    <header className="flex items-center gap-4">
      {!!session ? <LoggedIn session={session} /> : <LoggedOut />}
    </header>
  );
}

function LoggedOut() {
  return <Button onClick={() => signIn()}>Login</Button>;
}

function LoggedIn({ session }: { session: Session }) {
  return (
    <>
      {!!session?.user && (
        <div>
          <User user={session.user} />
        </div>
      )}
      <Button onClick={() => signOut()} size="icon" variant="secondary">
        <LogOutIcon className="h-4 w-4" />
      </Button>
    </>
  );
}

function User({ user }: { user: NonNullable<Session["user"]> }) {
  return (
    <div className="flex items-end">
      {!!user.role && user.role !== "user" && (
        <Badge variant="outline" className="z-10 translate-x-2 bg-white">
          {user.role}
        </Badge>
      )}
      <Avatar>
        <AvatarImage src={user.image || "/img/avatar.jpg"} />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
    </div>
  );
}