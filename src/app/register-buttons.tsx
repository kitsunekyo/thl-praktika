"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { register, unregister } from "./register";

export function RegisterButton({ trainingId }: { trainingId: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await register(trainingId);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }}
    >
      Anmelden
    </Button>
  );
}
export function UnregisterButton({ trainingId }: { trainingId: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await unregister(trainingId);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }}
    >
      Abmelden
    </Button>
  );
}
