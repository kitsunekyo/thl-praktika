"use client";

import { Invitation } from "@prisma/client";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { deleteInvitation } from "./actions";

export function InvitationButtons({ invitation }: { invitation: Invitation }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          startTransition(() => {
            deleteInvitation(invitation.id);
          });
        }}
      >
        Löschen
      </Button>
    </div>
  );
}
