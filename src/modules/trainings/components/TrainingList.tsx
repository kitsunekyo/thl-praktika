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
    <section>
      <div className="flex max-w-2xl items-center">
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
    </section>
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
    <ul className="relative max-w-2xl space-y-6">
      {Object.entries(groupedByMonth.months).map(([month, trainings]) => (
        <li key={month}>
          <p className="sticky top-[var(--header-size)] -mx-4 bg-gray-50 px-6 py-4 font-semibold md:top-0">
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
    <div className="space-y-2">
      <Image
        src="/img/dog-bucket.svg"
        width={196 / 1.75}
        height={224 / 1.75}
        alt="Hund mit Eimer am Kopf"
      />
      <p className="text-muted-foreground">
        Es wurden keine Praktika gefunden.
      </p>
    </div>
  );
}
