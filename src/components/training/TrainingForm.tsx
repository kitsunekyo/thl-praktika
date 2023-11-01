"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { add, format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTraining } from "@/app/(main)/trainer/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getFixedDate } from "@/lib/date";
import { cn } from "@/lib/utils";

export const formSchema = z
  .object({
    description: z.string(),
    date: z.date(),
    startTime: z.string(),
    endTime: z.string(),
    maxInterns: z.coerce.number(),
    customAddress: z.boolean(),
  })
  .refine(
    (data) => {
      const start = set(data.date, {
        hours: parseInt(data.startTime.split(":")[0]),
        minutes: parseInt(data.startTime.split(":")[1]),
      });
      const end = set(data.date, {
        hours: parseInt(data.endTime.split(":")[0]),
        minutes: parseInt(data.endTime.split(":")[1]),
      });
      return start < end;
    },
    {
      message: "Ende muss nach Start sein.",
      path: ["endTime"],
    },
  );

export function TrainingForm({ onSubmit }: { onSubmit?: () => void }) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      maxInterns: 3,
      date: add(getFixedDate(new Date()), { days: 1 }),
      startTime: "09:00",
      endTime: "17:00",
      customAddress: false,
    },
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const start = set(data.date, {
        hours: parseInt(data.startTime.split(":")[0]),
        minutes: parseInt(data.startTime.split(":")[1]),
      });
      const end = set(data.date, {
        hours: parseInt(data.endTime.split(":")[0]),
        minutes: parseInt(data.endTime.split(":")[1]),
      });
      const res = await createTraining({ ...data, start, end });

      if (res?.error) {
        toast({
          title: "Oops",
          description: `Das Praktikum konnte nicht erstellt werden. Versuch es nochmal.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Praktikum wurde erstellt",
        });
        form.reset();
        onSubmit?.();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="md:flex md:gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datum</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex w-full gap-2 text-left font-normal md:max-w-[240px]",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Datum wählen</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 flex md:mt-8">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mx-2 mt-2 text-center">
              <span>bis</span>
            </div>
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Welpengruppe, Kleinhunde. Abstand halten."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxInterns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximale Anzahl an Praktikant:innen</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customAddress"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Abweichende Adresse</FormLabel>
                <FormDescription>
                  Falls das Praktikum an einer anderen Adresse stattfindet, als
                  die in deinem Profil hinterlegte. (zB bei einem Kunden / einer
                  Kundin)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          Praktikum erstellen
        </Button>
      </form>
    </Form>
  );
}