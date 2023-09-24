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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import { createUser, inviteUser } from "../actions";

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.union([z.string().min(6), z.literal("")]),
  role: z.string(),
});

export function UserForm() {
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
        className="max-w-[300px] space-y-6"
        onSubmit={form.handleSubmit((data: z.infer<typeof userSchema>) => {
          startTransition(async () => {
            if (isPasswordEmpty) {
              const res = await inviteUser(data.email, data.name, data.role);
              if (res.error) {
                toast({
                  title: "Fehler beim Einladen",
                  description: `${data.email} konnte nicht eingeladen werden. Versuch es nochmal.`,
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "User wurde eingeladen",
                  description: `Es wurde eine Einladung an ${data.email} gesendet.`,
                });
              }
              return;
            }
            const res = await createUser(
              data.email,
              data.password,
              data.name,
              data.role,
            );
            if (res.error) {
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
                <Input type="email" placeholder="good@pup.com" {...field} />
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
                  <SelectItem value="user">user</SelectItem>
                  <SelectItem value="trainer">trainer</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
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
                <Input
                  type="text"
                  data-1p-ignore
                  placeholder="Sam S"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          User einladen
        </Button>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
