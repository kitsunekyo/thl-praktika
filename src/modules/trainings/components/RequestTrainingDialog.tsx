"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createTrainingRequest } from "@/modules/trainers/actions";

const formSchema = z.object({
  message: z.string().max(190).optional(),
});

export function RequestTrainingDialog({
  trainerId,
  children,
}: {
  trainerId: string;
  children: React.ReactNode;
}) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
    reValidateMode: "onChange",
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const res = await createTrainingRequest({
        trainerId,
        message: data.message,
      });
      if (res?.error === "only one request per trainer is allowed") {
        toast({
          title: "Fehler",
          description:
            "Du hast bereits eine Anfrage an diesen Trainer gesendet.",
          variant: "destructive",
        });
        return;
      }
      if (res?.error) {
        toast({
          title: "Fehler",
          description: "Da ist wohl was schief gegangen. Versuch es nochmal.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Anfrage gesendet",
        description:
          "Der/die Trainer:in wurde informiert, dass er/sie Praktika eintragen soll.",
      });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Möchtest du um ein Praktikum anfragen?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="my-4 space-y-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nachricht (optional)</FormLabel>
                    <FormControl>
                      <Textarea maxLength={200} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogDescription>
                Der/die Trainer:in bekommt ein E-Mail mit deiner Nachricht und
                deinen, im Profil eingetragenen, Kontaktdaten. Wenn ein
                Praktikum erstellt wird, bekommst du ein E-Mail.
              </AlertDialogDescription>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={!form.formState.isValid || loading}
              >
                Anfrage senden
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
