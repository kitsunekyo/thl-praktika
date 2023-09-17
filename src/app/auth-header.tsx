"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AuthHeader({ session }: { session: Session | null }) {
  return (
    <header className="flex gap-4 items-center mb-8">
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
      <Button onClick={() => signOut()}>Sign Out</Button>
      {!!session?.user && (
        <div className="ml-auto">
          <User user={session.user} />
        </div>
      )}
    </>
  );
}

function User({ user }: { user: NonNullable<Session["user"]> }) {
  return (
    <div className="flex items-center gap-2 border rounded p-2">
      <Avatar>
        {!!user.image && <AvatarImage src={user.image} />}
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <div>{user.name}</div>
        <div className="text-xs text-gray-500">{user.email}</div>
      </div>
    </div>
  );
}
