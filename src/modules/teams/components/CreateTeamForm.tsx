"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { createTeam } from "../actions";

const createTeamSchema = z.object({
  name: z.string(),
});

export function CreateTeamForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
    },
  });
  const [pending, startTransition] = useTransition();

  return (
    <Form {...form}>
      <form
        className="max-w-lg space-y-6"
        onSubmit={form.handleSubmit(
          (data: z.infer<typeof createTeamSchema>) => {
            startTransition(async () => {
              await createTeam(data.name).catch(() => {
                toast({
                  title: "Fehler beim Erstellen",
                  description: `Team konnte nicht erstellt werden.`,
                  variant: "destructive",
                });
              });

              toast({
                title: "Team wurde erstellt",
                description: `Dein Team "${data.name}" wurde erstellt.`,
              });
            });
          },
        )}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input type="text" data-1p-ignore required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          Team erstellen
        </Button>
      </form>
    </Form>
  );
}
