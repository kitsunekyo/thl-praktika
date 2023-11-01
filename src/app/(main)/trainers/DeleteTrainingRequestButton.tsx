"use client";

import { TrashIcon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { deleteTrainingRequest } from "./requests/actions";

export function DeleteButton({ requestId }: { requestId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="icon"
        variant="ghost"
        disabled={pending}
        onClick={() => {
          startTransition(() => {
            deleteTrainingRequest(requestId);
          });
        }}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
