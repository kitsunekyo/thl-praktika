"use client";

import { Button } from "@/components/ui/button";

import { deleteRegistration } from "./actions";

export function Actions({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="destructive"
        onClick={async () => {
          await deleteRegistration(id);
        }}
      >
        delete
      </Button>
    </div>
  );
}
