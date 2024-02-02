"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Training } from "@prisma/client";
import { BanIcon, PenIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cancelTraining, deleteTraining } from "@/app/(main)/trainer/actions";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { EditTrainingForm } from "./EditTrainingForm";

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
        <ConfirmCancelDialog trainingId={id} />
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

const cancelFormSchema = z.object({
  reason: z.string().min(1, { message: "Bitte gib einen Grund an." }),
});

function ConfirmCancelDialog({ trainingId }: { trainingId: string }) {
  const [loading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof cancelFormSchema>>({
    resolver: zodResolver(cancelFormSchema),
    defaultValues: {
      reason: "",
    },
    reValidateMode: "onChange",
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={loading}>
          <BanIcon className="mr-2 h-4 w-4" /> Absagen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data: z.infer<typeof cancelFormSchema>) => {
                startTransition(() => {
                  cancelTraining(trainingId, data.reason);
                });
              },
            )}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>
                Möchtest du das Praktikum wirklich absagen?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="my-4 space-y-2">
              <AlertDialogDescription>
                Alle Praktikanten, die sich für das Praktikum angemeldet haben
                werden per E-Mail benachrichtigt, dass das Praktikum abgesagt
                wurde.
              </AlertDialogDescription>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grund für die Absage*</FormLabel>
                    <FormControl>
                      <Textarea required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={!form.formState.isDirty || !form.formState.isValid}
              >
                Absagen
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
