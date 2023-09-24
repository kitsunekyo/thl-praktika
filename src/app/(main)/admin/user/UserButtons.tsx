"use client";

import { User } from "next-auth";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { deleteUser } from "./actions";

export function UserButtons({ user }: { user: User }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          startTransition(() => {
            deleteUser(user.id);
          });
        }}
      >
        Löschen
      </Button>
    </div>
  );
}
