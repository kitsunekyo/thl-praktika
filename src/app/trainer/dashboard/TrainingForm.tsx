"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, set, startOfDay } from "date-fns";
import { CalendarIcon, Regex } from "lucide-react";
import React from "react";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { formatTimeValue } from "@/lib/date";
import { cn } from "@/lib/utils";

import { createTraining } from "../actions";

export const trainingSchema = z
  .object({
    description: z.string().optional(),
    date: z.date(),
    startTime: z.string(),
    endTime: z.string(),
    maxInterns: z.coerce.number(),
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
  const form = useForm<z.infer<typeof trainingSchema>>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      description: "Welpengruppe",
      maxInterns: 3,
      date: startOfDay(new Date()),
      startTime: "08:00",
      endTime: "17:00",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data: z.infer<typeof trainingSchema>) => {
          createTraining(data);
        })}
        className="mx-auto space-y-8"
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
        <div className="flex flex-wrap md:flex-nowrap md:gap-4">
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
                          "flex w-[240px] pl-3 text-left font-normal",
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
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <span className="h-[17px]">&nbsp;</span>
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
          <div className="mx-4 mt-10 md:mx-0">
            <span>bis</span>
          </div>
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <span className="h-[17px]">&nbsp;</span>
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
        <Button type="submit">Erstellen</Button>
      </form>
    </Form>
  );
}
