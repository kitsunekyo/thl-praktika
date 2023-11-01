"use client";

import { SendIcon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { createTrainingRequest } from "./requests/actions";

export function RequestTrainingButton({
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
      <div className="space-y-2">
        <p className="text-xs italic text-gray-400">
          Nachdem du eine Anfrage gesendet hast musst du 7 Tage warten, bevor du
          die nächste senden kannst.
        </p>
        <Button size="sm" disabled={disabled}>
          Praktikum angefragt
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" disabled={loading} onClick={handleSend}>
      <SendIcon className="mr-2 h-4 w-4" />
      Praktikum anfragen
    </Button>
  );
}
