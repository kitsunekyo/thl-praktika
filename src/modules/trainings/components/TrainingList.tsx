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
  const [isShowAll, setIsShowAll] = useState(false);
  let filteredTrainings = trainings;
  if (!isShowAll) {
    filteredTrainings = trainings.filter((t) => t.end > new Date());
  }

  return (
    <>
      <div className="flex max-w-2xl items-center">
        <Tabs value={isShowAll ? "all" : "new"} className="ml-auto">
          <TabsList>
            <TabsTrigger value="new" onClick={() => setIsShowAll(false)}>
              Bevorstehende
            </TabsTrigger>
            <TabsTrigger value="all" onClick={() => setIsShowAll(true)}>
              Alle
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="py-6">
        {filteredTrainings.length > 0 ? (
          <ul className="max-w-2xl space-y-4">
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
    </>
  );
}
