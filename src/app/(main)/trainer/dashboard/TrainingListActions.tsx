"use client";

import { BanIcon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { deleteTraining } from "../actions";

export function TrainingListActions({ id }: { id: string }) {
  const [loading, startTransition] = useTransition();

  return (
    <div className="ml-auto flex items-center gap-2">
      <Button
        variant="default"
        size="sm"
        disabled={loading}
        onClick={() => {
          startTransition(() => {
            deleteTraining(id);
          });
        }}
      >
        <BanIcon className="mr-2 h-4 w-4" /> Absagen
      </Button>
    </div>
  );
}
