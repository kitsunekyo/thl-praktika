"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useState } from "react";
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

import { updateProfile } from "./actions";

export const profileSchema = z.object({
  name: z.string(),
});

export function ProfileForm({ user }: { user: Session["user"] }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="max-w-[300px] space-y-6"
        onSubmit={form.handleSubmit(
          async (data: z.infer<typeof profileSchema>) => {
            setLoading(true);
            try {
              await updateProfile(data);
              setLoading(false);
              form.reset(data);
            } catch {
              setLoading(false);
            }
          },
        )}
      >
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input value={user.email || ""} disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Dein Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading || !form.formState.isDirty}>
          Speichern
        </Button>
      </form>
    </Form>
  );
}
