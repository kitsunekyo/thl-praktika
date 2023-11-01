"use client";

import { User } from "@prisma/client";
import { CalendarPlusIcon } from "lucide-react";
import { useState } from "react";

import { TrainingForm } from "@/components/training/TrainingForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateTrainingButton({
  profile,
}: {
  profile: Pick<User, "id" | "city" | "address" | "zipCode">;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="r mb-8 flex items-center gap-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex h-12 w-full items-center gap-2 rounded bg-gray-100 px-4 text-sm text-gray-500 transition-colors hover:bg-gray-200">
            <CalendarPlusIcon className="h-4 w-4" />
            Erstelle ein Praktikum
          </button>
        </DialogTrigger>
        <DialogContent className="md:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="mb-4">Praktikum erstellen</DialogTitle>
            <TrainingForm
              onSubmit={() => setIsDialogOpen(false)}
              profile={profile}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
