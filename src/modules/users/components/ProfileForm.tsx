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
import { SafeUser } from "@/lib/prisma";
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
  city: z.string().optional(),
  zipCode: z.string().optional(),
});

export function ProfileForm({ user }: { user: SafeUser }) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      zipCode: user.zipCode || "",
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-6 md:flex md:gap-4 md:space-y-0">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postleitzahl</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel>Stadt</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={loading || !form.formState.isDirty}>
          Speichern
        </Button>
      </form>
    </Form>
  );
}
