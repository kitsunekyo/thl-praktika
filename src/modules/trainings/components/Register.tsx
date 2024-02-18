"use client";
import { UserPlusIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { register } from "@/modules/trainings/actions";

export function Register({ trainingId }: { trainingId: string }) {
  const { toast } = useToast();

  async function handleRegister(trainingId: string) {
    try {
      await register(trainingId);
      toast({
        title: "Angemeldet",
        description: "Du hast dich für das Praktikum angemeldet.",
      });
    } catch {
      toast({
        title: "Fehler",
        description: "Du konntest nicht angemeldet werden. Versuch es nochmal.",
        variant: "destructive",
      });
    }
  }

  return (
    <form action={() => handleRegister(trainingId)}>
      <RegisterButton />
    </form>
  );
}
export function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <Button size="sm" disabled={pending} type="submit">
      <UserPlusIcon className="mr-2 h-4 w-4" />
      Anmelden
    </Button>
  );
}
