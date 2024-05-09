"use client";

import { Registration, Training } from "@prisma/client";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const filteredTrainings =
    filter === "future"
      ? trainings.filter((t) => t.end >= new Date())
      : trainings.filter((t) => t.end < new Date());

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
        {filteredTrainings.length > 0 ? (
          <ul className="space-y-4">
            {filteredTrainings.map((t) => (
              <li key={t.id}>
                <TrainingCard training={t} user={user} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Keine Einträge.</p>
        )}
      </div>
    </div>
  );
}
