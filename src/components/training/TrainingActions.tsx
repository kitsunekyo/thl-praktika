"use client";

import { Training } from "@prisma/client";
import { BanIcon, CalendarPlusIcon, PenIcon } from "lucide-react";
import { useState, useTransition } from "react";

import { deleteTraining } from "@/app/(main)/trainer/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { EditTrainingForm } from "./EditTrainingForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function TrainingActions({
  training,
  id,
  hasRegistrations = false,
}: {
  id: string;
  training: Training;
  hasRegistrations?: boolean;
}) {
  const [loading, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex w-full items-center gap-2">
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
      {hasRegistrations ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={loading}>
              <BanIcon className="mr-2 h-4 w-4" /> Absagen
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bist du sicher?</AlertDialogTitle>
              <AlertDialogDescription>
                Alle Praktikanten, die sich für das Praktikum angemeldet haben
                werden per E-Mail benachrichtigt, dass das Praktikum abgesagt
                wurde.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  startTransition(() => {
                    deleteTraining(id);
                  });
                }}
              >
                Absagen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => {
            startTransition(() => {
              deleteTraining(id);
            });
          }}
        >
          <BanIcon className="mr-2 h-4 w-4" /> Absagen
        </Button>
      )}
    </div>
  );
}
