"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/components/ui/use-toast";
import { PrivateUser } from "@/lib/prisma";
import { updateProfile } from "@/modules/users/actions";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

export const profileSchema = z.object({
  name: z.string(),
  phone: z.union([
    z.literal(""),
    z.string().regex(phoneRegex, "Ungültige Telefonnummer"),
  ]),
  address: z.string().optional(),
});

export function ProfileForm({ user }: { user: PrivateUser }) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((data: z.infer<typeof profileSchema>) => {
          startTransition(async () => {
            const res = await updateProfile(data);
            if (res?.error) {
              toast({
                title: "Oops",
                description: `Dein Profil konnte nicht aktualisiert werden. Versuch es nochmal.`,
                variant: "destructive",
              });
              return;
            }
            toast({
              title: "Gespeichert",
              description: `Deine Änderungen wurden gespeichert.`,
            });
            form.reset(data);
          });
        })}
      >
        <FormItem>
          <FormLabel>Email*</FormLabel>
          <FormControl>
            <Input value={user.email} disabled />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Wenn du deine Adresse nicht angeben möchtest, kannst du hier
                auch nur einen Ort eingeben. Die Adresse wird zum Berechnen von
                Anfahrtszeiten genutzt.
              </FormDescription>
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
