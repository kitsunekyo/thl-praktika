"use client";

import { Registration, Training } from "@prisma/client";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SafeUser } from "@/lib/prisma";

import { TrainingItem } from "./TrainingItem";

export type Trainings = (Training & {
  author: SafeUser;
  registrations: (Registration & {
    user: SafeUser;
  })[];
})[];

export function TrainingList({
  trainings,
  role,
}: {
  trainings: Trainings;
  role: string;
}) {
  const [isShowAll, setIsShowAll] = useState(true);
  let filteredTrainings = trainings;
  if (!isShowAll) {
    filteredTrainings = trainings.filter((t) => t.end > new Date());
  }

  return (
    <>
      <div className="flex max-w-2xl items-center">
        <Tabs value={isShowAll ? "all" : "new"} className="ml-auto">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setIsShowAll(true)}>
              Alle
            </TabsTrigger>
            <TabsTrigger value="new" onClick={() => setIsShowAll(false)}>
              Bevorstehende
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="py-6">
        {filteredTrainings.length > 0 ? (
          <ul className="max-w-2xl space-y-4">
            {filteredTrainings.map((t) => (
              <li key={t.id}>
                <TrainingItem t={t} role={role} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Keine Einträge.</p>
        )}
      </div>
    </>
  );
}
