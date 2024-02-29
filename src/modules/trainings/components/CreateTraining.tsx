"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Address } from "@/modules/users/address";

import { CreateTrainingForm } from "./CreateTrainingForm";

export function CreateTraining({ profile }: { profile: Address }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Praktikum erstellen</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mb-4">Praktikum erstellen</DialogTitle>
        </DialogHeader>
        <CreateTrainingForm
          onSubmit={() => setIsDialogOpen(false)}
          profile={profile}
        />
      </DialogContent>
    </Dialog>
  );
}
