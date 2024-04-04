"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deleteRegistration } from "@/modules/trainings/actions";

export function RegistrationButtons({ id }: { id: string }) {
  const { toast } = useToast();

  async function handleDelete() {
    try {
      await deleteRegistration(id);
    } catch {
      toast({
        title: "Fehler",
        description:
          "Anmeldung konnte nicht gelöscht werden. Versuch es später nochmal.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button size="sm" variant="destructive" onClick={handleDelete}>
        Löschen
      </Button>
    </div>
  );
}
