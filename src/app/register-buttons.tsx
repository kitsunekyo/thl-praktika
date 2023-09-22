"use client";

import { UserMinusIcon, UserPlusIcon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { register, unregister } from "./register";

export function RegisterButton({ trainingId }: { trainingId: string }) {
  const [loading, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={() =>
        startTransition(() => {
          register(trainingId);
        })
      }
    >
      <UserPlusIcon className="mr-2 h-4 w-4" />
      Anmelden
    </Button>
  );
}
export function UnregisterButton({ trainingId }: { trainingId: string }) {
  const [loading, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={() =>
        startTransition(() => {
          unregister(trainingId);
        })
      }
    >
      <UserMinusIcon className="mr-2 h-4 w-4" />
      Abmelden
    </Button>
  );
}
