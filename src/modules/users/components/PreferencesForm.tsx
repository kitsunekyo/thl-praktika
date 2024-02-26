"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { updatePreferences } from "@/modules/users/actions";
import { preferencesSchema } from "@/modules/users/preferences";

export function PreferencesForm({
  preferences,
  role,
}: {
  preferences: z.infer<typeof preferencesSchema>;
  role: string;
}) {
  const [loading, startTransition] = useTransition();
  const form = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: preferences,
  });

  async function onSubmit(data: z.infer<typeof preferencesSchema>) {
    startTransition(async () => {
      const res = await updatePreferences(data);
      if (res?.error) {
        toast({
          title: "Fehler",
          description: "Einstellungen konnten nicht gespeichert werden.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Einstellungen gespeichert",
        description: "Deine Einstellungen wurden erfolgreich gespeichert.",
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-1 text-sm font-medium">
            E-Mail Benachrichtigungen
          </h3>
          <p className="mb-4 text-sm text-gray-400">
            Wähle, für welche Ereignisse du eine E-Mail Benachrichtigung
            erhalten möchtest.
          </p>
          <div className="space-y-4">
            {role === "admin" || role === "trainer" ? (
              <>
                <FormField
                  control={form.control}
                  name="email.trainingRegistration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg bg-white p-3 shadow">
                      <div className="space-y-0.5">
                        <FormLabel>Praktika Anmeldungen</FormLabel>
                        <FormDescription>
                          Ein(e) Praktikant:in hat sich für dein Praktikum
                          angemeldet.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email.trainingRegistrationCancelled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg bg-white p-3 shadow">
                      <div className="space-y-0.5">
                        <FormLabel>Praktika Abmeldungen</FormLabel>
                        <FormDescription>
                          Ein(e) Praktikant:in hat sich von deinem Praktikum
                          abgemeldet.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email.trainingRequest"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg bg-white p-3 shadow">
                      <div className="space-y-0.5">
                        <FormLabel>Praktika Anfragen</FormLabel>
                        <FormDescription>
                          Ein(e) Praktikant:in möchte ein Praktikum bei dir
                          machen.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            ) : null}
            {role === "admin" || role === "user" ? (
              <>
                <FormField
                  control={form.control}
                  name="email.trainingCreatedAfterRegistration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg bg-white p-3 shadow">
                      <div className="space-y-0.5">
                        <FormLabel>Praktikum erstellt</FormLabel>
                        <FormDescription>
                          Ein(e) Trainer:in, bei der du eine Praktika Anfrage
                          gestellt hast, hat ein Praktikum erstellt.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email.trainingCancelled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg bg-white p-3 shadow">
                      <div className="space-y-0.5">
                        <FormLabel>Praktikum abgesagt</FormLabel>
                        <FormDescription>
                          Ein Praktikum bei dem du angemeldet warst wurde
                          abgesagt.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email.trainingUpdated"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg bg-white p-3 shadow">
                      <div className="space-y-0.5">
                        <FormLabel>Praktikum geändert</FormLabel>
                        <FormDescription>
                          Ein Praktikum bei dem du angemeldet bist wurde
                          geändert.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            ) : null}
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          Speichern
        </Button>
      </form>
    </Form>
  );
}
