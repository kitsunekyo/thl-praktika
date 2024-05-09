"use client";

import { Registration, Training } from "@prisma/client";
import { useMemo, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatAT } from "@/lib/date";
import { SafeUser } from "@/lib/prisma";

import { TrainingCard } from "./TrainingCard";

export type Trainings = (Training & {
  author: SafeUser;
  registrations: (Registration & {
    user: SafeUser;
  })[];
})[];

export function TrainingList({
  trainings,
  user,
}: {
  trainings: Trainings;
  user: Pick<SafeUser, "id" | "role">;
}) {
  const [filter, setFilter] = useState<"future" | "past">("future");

  const groupedByMonth = useMemo(() => {
    const filteredTrainings =
      filter === "future"
        ? trainings.filter((t) => t.end >= new Date())
        : trainings.filter((t) => t.end < new Date());

    return filteredTrainings.reduce(
      (acc, t) => {
        const month = formatAT(t.start, "MMMM");
        if (!acc.months[month]) {
          acc.months[month] = [];
        }
        acc.months[month].push(t);
        return acc;
      },
      {
        count: filteredTrainings.length,
        months: {} as Record<string, Trainings>,
      },
    );
  }, [trainings, filter]);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center">
        <Tabs value={filter}>
          <TabsList>
            <TabsTrigger value="future" onClick={() => setFilter("future")}>
              Bevorstehende
            </TabsTrigger>
            <TabsTrigger value="past" onClick={() => setFilter("past")}>
              Vergangene
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="py-6">
        {groupedByMonth.count > 0 ? (
          Object.entries(groupedByMonth.months).map(([month, trainings]) => (
            <div key={month} className="mb-6">
              <h2 className="font-semibold">{month}</h2>
              <ul className="space-y-4">
                {trainings.map((t) => (
                  <li key={t.id}>
                    <TrainingCard training={t} user={user} />
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Keine Einträge.</p>
        )}
      </div>
    </div>
  );
}
