"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { inviteUser } from "@/modules/users/actions";

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.union([z.literal("user"), z.literal("trainer"), z.literal("admin")]),
  sendEmail: z.boolean(),
});

export function InviteUserForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "user",
      sendEmail: false,
    },
  });
  const [pending, startTransition] = useTransition();

  return (
    <Form {...form}>
      <form
        className="max-w-lg space-y-6"
        onSubmit={form.handleSubmit((data: z.infer<typeof userSchema>) => {
          startTransition(async () => {
            const res = await inviteUser(
              data.email,
              data.name,
              data.role,
              data.sendEmail,
            );
            if (res?.error) {
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
              redirect("/admin/invitations");
            }
            return;
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
        <FormField
          control={form.control}
          name="sendEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Einladungs Email</FormLabel>
                <FormDescription>
                  Sende eine Einladungs-Email an den Benutzer
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
        <Button type="submit" disabled={pending}>
          User einladen
        </Button>
      </form>
    </Form>
  );
}
