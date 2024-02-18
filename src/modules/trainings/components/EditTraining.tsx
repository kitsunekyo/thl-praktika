"use client";
import { Training } from "@prisma/client";
import { PenIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditTrainingForm } from "./EditTrainingForm";

export function EditTraining({ training }: { training: Training }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PenIcon className="mr-2 h-4 w-4" />
          Bearbeiten
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mb-4">Praktikum bearbeiten</DialogTitle>
        </DialogHeader>
        <EditTrainingForm
          training={training}
          onSubmit={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
