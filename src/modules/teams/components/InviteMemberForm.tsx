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

import { inviteMember } from "../actions";

const inviteMemberSchema = z.object({
  email: z.string().email(),
});

export function InviteMemberForm({ teamId }: { teamId: string }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
    },
  });
  const [pending, startTransition] = useTransition();

  return (
    <Form {...form}>
      <form
        className="max-w-lg space-y-6"
        onSubmit={form.handleSubmit(
          (data: z.infer<typeof inviteMemberSchema>) => {
            startTransition(async () => {
              const res = await inviteMember(teamId, data.email);

              if (res?.error) {
                toast({
                  title: "Fehler beim Einladen",
                  variant: "destructive",
                });
                return;
              }

              toast({
                title: "Benutzer wurde eingeladen",
              });
            });
          },
        )}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail*</FormLabel>
              <FormControl>
                <Input type="text" data-1p-ignore required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          Benutzer einladen
        </Button>
      </form>
    </Form>
  );
}
