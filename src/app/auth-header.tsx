"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AuthHeader({ session }: { session: Session | null }) {
  return (
    <header className="mb-8 flex items-center gap-4">
      {!!session ? <LoggedIn session={session} /> : <LoggedOut />}
    </header>
  );
}

function LoggedOut() {
  return (
    <>
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  );
}

function LoggedIn({ session }: { session: Session }) {
  return (
    <>
      {!!session?.user && (
        <div>
          <User user={session.user} />
        </div>
      )}
      <Button onClick={() => signOut()} size="sm" variant="ghost">
        Sign Out
      </Button>
    </>
  );
}

function User({ user }: { user: NonNullable<Session["user"]> }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        {!!user.image && <AvatarImage src={user.image} />}
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <div className="flex items-center gap-2">
          {user.name}
          {!!user.role && <Badge>{user.role}</Badge>}
        </div>
        <div className="text-xs text-gray-500">{user.email}</div>
      </div>
    </div>
  );
}
