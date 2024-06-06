"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { BanIcon } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cancelTraining, deleteTraining } from "@/modules/trainers/actions";

const cancelFormSchema = z.object({
  reason: z.string().min(1, { message: "Bitte gib einen Grund an." }),
});

export function CancelTraining({
  trainingId,
  hasRegistrations,
}: {
  trainingId: string;
  hasRegistrations: boolean;
}) {
  const [loading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof cancelFormSchema>>({
    resolver: zodResolver(cancelFormSchema),
    defaultValues: {
      reason: "",
    },
    reValidateMode: "onChange",
  });

  const handleSubmit = (data: z.infer<typeof cancelFormSchema>) => {
    startTransition(() => {
      cancelTraining(trainingId, data.reason);
    });
  };

  if (!hasRegistrations) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={() => {
          startTransition(() => {
            deleteTraining(trainingId);
          });
        }}
      >
        <BanIcon className="mr-2 h-4 w-4" /> Löschen
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={loading}>
          <BanIcon className="mr-2 h-4 w-4" /> Absagen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
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
