"use client";

import { Button } from "@/components/ui/button";

import { deleteRegistration } from "./actions";
export function ActionButtons({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="destructive"
        onClick={() => deleteRegistration(id)}
      >
        Löschen
      </Button>
    </div>
  );
}
