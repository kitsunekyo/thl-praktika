"use client";

import { Invitation } from "@prisma/client";
import { MailQuestionIcon, TrashIcon } from "lucide-react";
import { useTransition } from "react";

import {
  deleteInvitation,
  resendInvitation,
} from "@/app/(main)/admin/invitations/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function InvitationButtons({ invitation }: { invitation: Invitation }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="icon"
        variant="ghost"
        disabled={pending}
        onClick={() => {
          startTransition(() => {
            resendInvitation(invitation.id);
            toast({
              title: "Einladungs E-Mail versendet",
              description:
                "Die Einladung wurde erneut an die angegebene E-Mail Adresse versendet.",
            });
          });
        }}
      >
        <MailQuestionIcon className="h-4 w-4" />
      </Button>
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
