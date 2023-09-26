"use client";

import { Invitation } from "@prisma/client";
import { TrashIcon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { deleteInvitation } from "./actions";

export function InvitationButtons({ invitation }: { invitation: Invitation }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="icon"
        variant="ghost"
        disabled={pending}
        onClick={() => {
          startTransition(() => {
            deleteInvitation(invitation.id);
          });
        }}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
