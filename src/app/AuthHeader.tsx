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
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={user.image || "/img/avatar.jpg"} />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <div className="flex items-center gap-2">
          {user.name}
          {!!user.role && <Badge variant="outline">{user.role}</Badge>}
        </div>
        <div className="text-xs text-gray-500">{user.email}</div>
      </div>
    </div>
  );
}
