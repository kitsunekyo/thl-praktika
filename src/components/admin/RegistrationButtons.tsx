"use client";

import { deleteRegistration } from "@/app/(main)/admin/registrations/actions";
import { Button } from "@/components/ui/button";

export function RegistrationButtons({ id }: { id: string }) {
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
