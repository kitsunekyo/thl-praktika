"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Training, User } from "@prisma/client";
import { add, format, set } from "date-fns";
import { CalendarIcon, InfoIcon } from "lucide-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTraining, updateTraining } from "@/app/(main)/trainer/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
    city: z.string(),
    zipCode: z.string(),
    address: z.string(),
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

export function EditTrainingForm({
  training,
  onSubmit,
}: {
  training: Training;
  onSubmit?: () => void;
}) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: training.description || "",
      maxInterns: training.maxInterns,
      date: getFixedDate(training.start),
      startTime: format(training.start, "HH:mm"),
      endTime: format(training.end, "HH:mm"),
      city: training.city || "",
      zipCode: training.zipCode || "",
      address: training.address || "",
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
      const res = await updateTraining(training.id, { ...data, start, end });

      if (res?.error) {
        toast({
          title: "Oops",
          description: `Das Praktikum konnte nicht geändert werden. Versuch es nochmal.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Praktikum wurde geändert",
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
                <FormLabel>Datum*</FormLabel>
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
              <FormLabel>Maximale Anzahl an Praktikanten (1-6)*</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={6} disabled {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Du kannst die Anzahl an Praktikanten nachträglich nicht mehr
                ändern.
              </FormDescription>
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
        <aside className="space-y-2 pt-8">
          <div className="flex gap-2">
            <InfoIcon className="h-4 w-4 shrink-0 opacity-50" />
            <p className="text-xs text-muted-foreground">
              Alle angemeldeten Student:innen werden per E-Mail über die
              Änderung informiert.
            </p>
          </div>
        </aside>
        <div className="flex">
          <Button type="submit" disabled={loading} className="ml-auto">
            Praktikum ändern
          </Button>
        </div>
      </form>
    </Form>
  );
}