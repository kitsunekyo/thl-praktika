"use client";

import { UserMinusIcon, UserPlusIcon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { register, unregister } from "../training-actions";

export function RegisterButton({ trainingId }: { trainingId: string }) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <Button
      size="sm"
      disabled={loading}
      onClick={() =>
        startTransition(async () => {
          const res = await register(trainingId);
          if (res?.error) {
            toast({
              title: "Fehler",
              description:
                "Du konntest nicht angemeldet werden. Versuch es nochmal.",
              variant: "destructive",
            });
            return;
          }
          toast({
            title: "Angemeldet",
            description: "Du hast dich für das Training angemeldet.",
          });
        })
      }
    >
      <UserPlusIcon className="mr-2 h-4 w-4" />
      Anmelden
    </Button>
  );
}
export function UnregisterButton({ trainingId }: { trainingId: string }) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={loading}
      onClick={() =>
        startTransition(async () => {
          const res = await unregister(trainingId);
          if (res?.error) {
            toast({
              title: "Fehler",
              description:
                "Du konntest nicht abgemeldet werden. Versuch es nochmal.",
              variant: "destructive",
            });
            return;
          }
          toast({
            title: "Abgemeldet",
            description: "Du hast dich vom Training abgemeldet.",
          });
        })
      }
    >
      <UserMinusIcon className="mr-2 h-4 w-4" />
      Abmelden
    </Button>
  );
}
