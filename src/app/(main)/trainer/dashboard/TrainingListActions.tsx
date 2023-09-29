"use client";

import { BanIcon } from "lucide-react";
import { useTransition } from "react";

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

import { deleteTraining } from "../actions";

export function TrainingListActions({ id }: { id: string }) {
  const [loading, startTransition] = useTransition();

  return (
    <div className="flex w-full items-center gap-2">
      {/* <Button size="sm" variant="secondary">
        Bearbeiten
      </Button> */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="ml-auto"
            disabled={loading}
          >
            <BanIcon className="mr-2 h-4 w-4" /> Absagen
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bist du sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Alle Praktikant:innen, die sich für das Training angemeldet haben
              werden per E-Mail benachrichtigt, dass das Training abgesagt
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
    </div>
  );
}
