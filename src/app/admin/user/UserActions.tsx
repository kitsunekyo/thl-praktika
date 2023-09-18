"use client";

import { Button } from "@/components/ui/button";

import { deleteUser } from "./actions";

export function UserActions({
  user,
}: {
  user: {
    name: string | null;
    email: string | null;
    id: string;
    role: string;
  };
}) {
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
