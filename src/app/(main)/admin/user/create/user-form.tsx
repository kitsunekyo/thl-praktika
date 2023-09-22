"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

import { createUser, inviteUser } from "../actions";

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.union([z.string().min(6), z.literal("")]),
  role: z.string(),
});

export function UserForm() {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: "user",
    },
  });

  const isPasswordEmpty = form.getValues("password").length <= 0;

  return (
    <Form {...form}>
      <form
        className="max-w-[300px] space-y-6"
        onSubmit={form.handleSubmit((data: z.infer<typeof userSchema>) => {
          if (isPasswordEmpty) {
            inviteUser(data.email, data.name, data.role);
            return;
          }
          createUser(data.email, data.password, data.role);
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
        <Button type="submit">User einladen</Button>

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
        <Button type="submit" disabled={isPasswordEmpty}>
          User erstellen
        </Button>
      </form>
    </Form>
  );
}
