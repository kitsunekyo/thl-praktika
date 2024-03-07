"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClockIcon, SendIcon } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { createTrainingRequest } from "@/modules/trainers/actions";

const formSchema = z.object({
  message: z.string().max(190).optional(),
});

export function RequestTraining({
  trainerId,
  disabled,
}: {
  trainerId: string;
  disabled?: boolean;
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

  if (disabled) {
    return (
      <div className="inline-flex items-center gap-2 rounded py-2 text-sm font-medium text-muted-foreground">
        <ClockIcon className="h-4 w-4" />
        Praktikumsanfrage offen
      </div>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" disabled={loading}>
          Praktikum anfragen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Möchtest du um ein Praktikum anfragen?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="my-4 space-y-2">
              <AlertDialogDescription>
                Der/die Trainer:in wird per E-Mail informiert, dass du Interesse
                an einem Praktikum hast. Sobald der/die Trainer:in das Praktikum
                auf der Seite eingetragen hat, wirst du per E-Mail
                benachrichtigt.
              </AlertDialogDescription>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nachricht an den/die Trainer:in (optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea maxLength={190} {...field} />
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
                disabled={!form.formState.isValid}
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
