"use client";

import { Button } from "@/components/ui/button";

import { deleteRegistration } from "./actions";
export function ActionButtons({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <form action={() => deleteRegistration(id)}>
        <input type="hidden" name="id" value={id} />
        <Button size="sm" variant="destructive">
          delete
        </Button>
      </form>
    </div>
  );
}
