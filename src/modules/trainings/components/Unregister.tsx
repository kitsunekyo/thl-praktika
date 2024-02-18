"use client";
import { UserMinusIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { unregister } from "@/modules/trainings/actions";

export function Unregister({ trainingId }: { trainingId: string }) {
  const { toast } = useToast();

  async function handleUnregister(trainingId: string) {
    try {
      await unregister(trainingId);
      toast({
        title: "Abgemeldet",
        description: "Du hast dich vom Praktikum abgemeldet.",
      });
    } catch {
      toast({
        title: "Fehler",
        description: "Du konntest nicht abgemeldet werden. Versuch es nochmal.",
        variant: "destructive",
      });
    }
  }

  return (
    <form action={() => handleUnregister(trainingId)}>
      <UnregisterButton />
    </form>
  );
}
function UnregisterButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="secondary" size="sm" disabled={pending} type="submit">
      <UserMinusIcon className="mr-2 h-4 w-4" />
      Abmelden
    </Button>
  );
}
