"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
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

import { updateProfile } from "./actions";

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

export function ProfileForm({ user }: { user: Omit<User, "password"> }) {
  const [loading, startTransition] = useTransition();
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
        className="max-w-[300px] space-y-6"
        onSubmit={form.handleSubmit((data: z.infer<typeof profileSchema>) => {
          startTransition(async () => {
            await updateProfile(data);
            form.reset(data);
          });
        })}
      >
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
        <FormItem>
          <FormLabel>Email*</FormLabel>
          <FormControl>
            <Input value={user.email} disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
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
            <FormItem>
              <FormLabel>Stadt</FormLabel>
              <FormControl>
                <Input {...field} />
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
