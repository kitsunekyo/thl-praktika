"use client";

import { BanIcon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { deleteTraining } from "../actions";

export function TrainingListActions({ id }: { id: string }) {
  const [loading, startTransition] = useTransition();

  return (
    <div className="flex w-full items-center gap-2">
      {/* <Button size="sm" variant="secondary">
        Bearbeiten
      </Button> */}
      <Button
        variant="destructive"
        size="sm"
        className="ml-auto"
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
