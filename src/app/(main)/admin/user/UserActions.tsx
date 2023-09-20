"use client";

import { User } from "next-auth";

import { Button } from "@/components/ui/button";

import { deleteUser } from "./actions";

export function UserActions({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="destructive"
        onClick={() => deleteUser(user.id)}
      >
        Löschen
      </Button>
    </div>
  );
}
