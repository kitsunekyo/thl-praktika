"use client";

import { ClockIcon, SendIcon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createTrainingRequest } from "@/modules/trainers/actions";

export function RequestTraining({
  trainerId,
  disabled,
}: {
  trainerId: string;
  disabled?: boolean;
}) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  function handleSend() {
    startTransition(async () => {
      const res = await createTrainingRequest({ trainerId });
      if (res?.error === "only one request per trainer is allowed") {
        toast({
          title: "Fehler",
          description:
            "Du hast bereits eine Anfrage an diesen Trainer gesendet.",
          variant: "destructive",
        });
        return;
      }
      if (res?.error) {
        toast({
          title: "Fehler",
          description: "Da ist wohl was schief gegangen. Versuch es nochmal.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Anfrage gesendet",
        description:
          "Der/die Trainer:in wurde informiert, dass er/sie Praktika eintragen soll.",
      });
    });
  }

  if (disabled) {
    return (
      <div className="inline-flex items-center gap-2 rounded py-2 text-sm font-medium text-muted-foreground">
        <ClockIcon className="h-4 w-4" />
        Praktikumsanfrage offen
      </div>
    );
  }

  return (
    <Button size="sm" disabled={loading} onClick={handleSend}>
      <SendIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
      Praktikum anfragen
    </Button>
  );
}
