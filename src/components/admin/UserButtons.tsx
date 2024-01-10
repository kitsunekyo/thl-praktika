"use client";

import { TrashIcon } from "lucide-react";
import { User } from "next-auth";
import { useTransition } from "react";

import { deleteUser } from "@/app/(main)/admin/users/actions";
import { Button } from "@/components/ui/button";

export function UserButtons({ user }: { user: User }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="icon"
        variant="ghost"
        disabled={pending}
        onClick={() => {
          startTransition(() => {
            deleteUser(user.id);
          });
        }}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
