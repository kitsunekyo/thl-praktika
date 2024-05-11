"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatAT } from "@/lib/date";
import { PrivateUser } from "@/lib/prisma";

import { TrainingCard, TrainingWithMetadata } from "./TrainingCard";

export function TrainingListWithDateFilter({
  trainings,
  user,
}: {
  trainings: TrainingWithMetadata[];
  user: Pick<PrivateUser, "id" | "role">;
}) {
  const [filter, setFilter] = useState<"future" | "past">("future");

  const { future, past } = useMemo(() => {
    const future: TrainingWithMetadata[] = [];
    const past: TrainingWithMetadata[] = [];

    trainings.forEach((t) => {
      if (t.start >= new Date()) {
        future.push(t);
      } else {
        past.push(t);
      }
    });
    return {
      future,
      past,
    };
  }, [trainings]);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center">
        <Tabs value={filter}>
          <TabsList>
            <TabsTrigger
              value="future"
              onClick={() => setFilter("future")}
              className="flex items-baseline gap-1"
            >
              <span>Bevorstehende</span>
              <span className="text-xs opacity-60">({future.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="past"
              onClick={() => setFilter("past")}
              className="flex items-baseline gap-1"
            >
              <span>Vergangene</span>
              <span className="text-xs opacity-60">({past.length})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="py-6">
        <TrainingList
          trainings={filter === "future" ? future : past}
          user={user}
        />
      </div>
    </div>
  );
}

export function TrainingList({
  trainings,
  user,
}: {
  trainings: TrainingWithMetadata[];
  user: Pick<PrivateUser, "id" | "role">;
}) {
  const groupedByMonth = useMemo(() => {
    return trainings.reduce(
      (acc, t) => {
        const month = formatAT(t.start, "MMMM");
        if (!acc.months[month]) {
          acc.months[month] = [];
        }
        acc.months[month].push(t);
        return acc;
      },
      {
        count: trainings.length,
        months: {} as Record<string, TrainingWithMetadata[]>,
      },
    );
  }, [trainings]);

  if (trainings.length === 0) {
    return <NoTrainings />;
  }

  return (
    <ul className="relative space-y-6">
      {Object.entries(groupedByMonth.months).map(([month, trainings]) => (
        <li key={month}>
          <p className="sticky top-[var(--header-size)] -mx-4 bg-gray-50 px-6 py-4 font-semibold">
            {month}
          </p>
          <ul className="space-y-4">
            {trainings.map((t) => (
              <li key={t.id}>
                <TrainingCard training={t} user={user} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function NoTrainings() {
  return (
    <>
      <Image
        src="/img/dog-bucket.svg"
        className="h-40"
        width={196}
        height={224}
        alt="Hund mit Eimer am Kopf"
      />
      <h3 className="mb-2 mt-6 text-xl font-bold tracking-tight sm:text-xl">
        Keine Praktika
      </h3>

      <p className="mb-6 text-muted-foreground">
        Es wurden keine Praktika gefunden.
      </p>
    </>
  );
}
