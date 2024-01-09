"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createUser } from "@/app/(main)/admin/users/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6),
  role: z.string(),
});

export function CreateUserForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: "user",
    },
  });
  const [pending, startTransition] = useTransition();

  const isPasswordEmpty = form.getValues("password").length <= 0;

  return (
    <Form {...form}>
      <form
        className="max-w-lg space-y-6"
        onSubmit={form.handleSubmit((data: z.infer<typeof userSchema>) => {
          startTransition(async () => {
            const res = await createUser(
              data.email,
              data.password,
              data.name,
              data.role,
            );
            if (res?.error) {
              toast({
                title: "Fehler beim Erstellen",
                description: `${data.email} konnte nicht erstellt werden. Versuch es nochmal.`,
                variant: "destructive",
              });
            } else {
              toast({
                title: "User wurde erstellt",
                description: `User ${data.email} wurde erstellt.`,
              });
            }

            redirect("/admin/users");
          });
        })}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rolle*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle eine Rolle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" data-1p-ignore {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort*</FormLabel>
              <FormControl>
                <Input type="password" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending || isPasswordEmpty}>
          User erstellen
        </Button>
      </form>
    </Form>
  );
}
