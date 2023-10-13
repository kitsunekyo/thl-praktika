"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getInitials } from "@/lib/utils";

import { TrainingForm } from "./trainer/dashboard/TrainingForm";

export function CreateTrainingButton({
  profile,
}: {
  profile: { name: string | null; email: string; image: string | null };
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="mb-8 flex items-center gap-2">
      <Avatar className="shrink-0">
        <AvatarImage src={profile.image || "/img/avatar.jpg"} />
        <AvatarFallback>{getInitials(profile)}</AvatarFallback>
      </Avatar>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex h-10 w-full items-center rounded-full border bg-gray-50 px-4 text-left text-sm text-gray-500 transition-colors hover:bg-gray-100">
            Erstelle ein Training
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Training erstellen</DialogTitle>
            <TrainingForm onSubmit={() => setIsDialogOpen(false)} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
