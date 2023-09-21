"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { formatTimeValue, getFixedDate } from "@/lib/date";
import { cn } from "@/lib/utils";

import { createTraining } from "./actions";

export const trainingSchema = z
  .object({
    description: z.string().optional(),
    date: z.date(),
    startTime: z.string(),
    endTime: z.string(),
    maxInterns: z.coerce.number(),
    customAddress: z.boolean(),
  })
  .refine(
    (data) => {
      const [startHours, startMinutes] = data.startTime.split(":");
      const start = set(new Date(), {
        hours: parseInt(startHours),
        minutes: parseInt(startMinutes),
      });
      const [endHours, endMinutes] = data.endTime.split(":");
      const end = set(new Date(), {
        hours: parseInt(endHours),
        minutes: parseInt(endMinutes),
      });
      return start < end;
    },
    {
      message: "muss später sein",
      path: ["endTime"],
    },
  );

export function TrainingForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof trainingSchema>>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      description: "",
      maxInterns: 3,
      date: getFixedDate(new Date()),
      startTime: "12:00",
      endTime: "17:00",
      customAddress: false,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          async (data: z.infer<typeof trainingSchema>) => {
            setLoading(true);
            try {
              await createTraining(data);
              setLoading(false);
            } catch {
              setLoading(false);
            }
          },
        )}
        className="mx-auto space-y-4 md:space-y-8"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Welpengruppe, Kleinhunde, etc."
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
                          "flex w-full pl-3 text-left font-normal md:w-[240px]",
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
                      initialFocus
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
                    <Input
                      placeholder="08:00"
                      maxLength={5}
                      data-1p-ignore
                      {...field}
                      onFocus={(e) => e.currentTarget.select()}
                      onBlur={(e) => {
                        const newValue = formatTimeValue(e.currentTarget.value);
                        form.setValue(field.name, newValue);
                        field.onBlur();
                      }}
                    />
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
                    <Input
                      placeholder="17:00"
                      maxLength={5}
                      data-1p-ignore
                      {...field}
                      onFocus={(e) => e.currentTarget.select()}
                      onBlur={(e) => {
                        const newValue = formatTimeValue(e.currentTarget.value);
                        form.setValue(field.name, newValue);
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
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
                  Falls das Training an einer anderen Adresse stattfindet, als
                  die in deinem Profil hinterlegte. (zB bei einem Kunden / einer
                  Kundin)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          Erstellen
        </Button>
      </form>
    </Form>
  );
}
