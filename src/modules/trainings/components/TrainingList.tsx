"use client";

import { Registration, Training, User } from "@prisma/client";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CancelTraining } from "./CancelTraining";
import { EditTraining } from "./EditTraining";
import { TrainingCard } from "./TrainingCard";
import { Unregister } from "./Unregister";

type Trainings = (Training & {
  author: Omit<User, "password">;
  registrations: (Registration & {
    user: Pick<
      User,
      | "id"
      | "image"
      | "name"
      | "phone"
      | "email"
      | "address"
      | "city"
      | "zipCode"
    >;
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

function TrainingItem({ t, role }: { t: Trainings[0]; role: string }) {
  let actions = null;
  if (role === "trainer" && t.end > new Date()) {
    actions = (
      <>
        <EditTraining training={t} />
        <CancelTraining
          trainingId={t.id}
          hasRegistrations={Boolean(t.registrations.length)}
        />
      </>
    );
  }
  if (role === "user" && t.end > new Date()) {
    actions = <Unregister trainingId={t.id} />;
  }

  return <TrainingCard training={t} actions={actions} />;
}
