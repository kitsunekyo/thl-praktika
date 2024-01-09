"use client";

import { SendIcon } from "lucide-react";
import { useTransition } from "react";

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
      <div className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-400">
        Offene Anfrage
      </div>
    );
  }

  return (
    <button
      className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
      disabled={loading}
      onClick={handleSend}
    >
      <SendIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
      Praktikum anfragen
    </button>
  );
}
