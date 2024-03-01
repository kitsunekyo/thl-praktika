import { Registration, Training } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import { SafeUser } from "@/lib/prisma";
import { CreateTraining } from "@/modules/trainings/components/CreateTraining";
import { TrainingCard } from "@/modules/trainings/components/TrainingCard";
import {
  Filter,
  TrainingFilter,
} from "@/modules/trainings/components/TrainingFilter";
import {
  computeDuration,
  computeTraveltime,
} from "@/modules/trainings/compute-data";
import { getTrainings } from "@/modules/trainings/queries";
import { getProfile } from "@/modules/users/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const profile = await getProfile();

  const filter = getFilter(searchParams);
  const trainings = await getTrainings();
  const filteredTrainings = await filterTrainings({
    trainings: await addMetadata(trainings),
    filter,
  });

  const userHasAddress = Boolean(
    profile.address || profile.zipCode || profile.city,
  );

  return (
    <section className="gap-8 md:flex md:py-6">
      <aside className="relative shrink-0 basis-80">
        <div className="sticky top-0">
          <TrainingFilter hasAddress={userHasAddress} value={filter} />
        </div>
      </aside>
      <main className="mb-6 md:w-full md:max-w-[600px] md:py-6">
        <div className="mb-4 divide-y rounded-xl bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-lg font-medium">Bevorstehende Praktika</h2>
          </div>
          <div className="flex items-center px-4 py-2">
            <CountLabel
              count={filteredTrainings.length}
              total={trainings.length}
            />
            {profile.role !== "user" && (
              <div className="ml-auto">
                <CreateTraining profile={profile} />
              </div>
            )}
          </div>
        </div>
        {trainings.length === 0 && <NoTrainings />}
        {filteredTrainings.length > 0 && (
          <ul className="space-y-4">
            {filteredTrainings.map((t) => (
              <li key={t.id}>
                <TrainingCard training={t} user={profile} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </section>
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
        Keine Praktika gefunden
      </h3>

      <p className="mb-6 text-muted-foreground">
        Aktuell hat niemand ein Praktikum eingetragen. Du kannst bei{" "}
        <Link href="/trainers" className="underline">
          Trainer:innen
        </Link>{" "}
        eine Anfrage stellen .
      </p>
    </>
  );
}

function CountLabel({ count, total }: { count: number; total: number }) {
  let trainingsCountLabel: string;
  if (count === total) {
    trainingsCountLabel = `${count} Praktika`;
  } else {
    trainingsCountLabel = `${count} von ${total} Praktika`;
  }

  return <p className="text-sm text-muted-foreground">{trainingsCountLabel}</p>;
}

function getFilter(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return {
    traveltime: Number(searchParams.traveltime),
    duration: Number(searchParams.duration),
    free: Number(searchParams.free),
    from:
      typeof searchParams.from === "string"
        ? startOfDay(new Date(searchParams.from))
        : undefined,
    to:
      typeof searchParams.to === "string"
        ? endOfDay(new Date(searchParams.to))
        : undefined,
    search: typeof searchParams.search === "string" ? searchParams.search : "",
  };
}

async function filterTrainings({
  trainings,
  filter,
}: {
  trainings: TrainingsWithMetadata;
  filter: Filter;
}) {
  const { traveltime, duration, free } = filter;

  return trainings.filter((t) => {
    if (t.duration < duration * 3600000) {
      return false;
    }
    if (t.maxInterns - t.registrations.length < free) {
      return false;
    }
    if (t.traveltime !== undefined && t.traveltime > traveltime * 60) {
      return false;
    }
    if (filter.from && t.start < filter.from) {
      return false;
    }
    if (filter.to && t.end >= filter.to) {
      return false;
    }
    if (filter.search) {
      const haystack =
        `${t.author.name} ${t.author.email} ${t.description} ${t.address} ${t.city} ${t.zipCode}`.toLowerCase();
      if (haystack.includes(filter.search.toLowerCase())) {
        return true;
      }
      return false;
    }
    return true;
  });
}

export type TrainingsWithMetadata = Awaited<ReturnType<typeof addMetadata>>;
async function addMetadata<
  T extends Training & {
    author: SafeUser;
    registrations: (Registration & {
      user: SafeUser;
    })[];
  },
>(trainings: T[]) {
  return Promise.all(
    trainings.map(
      async (training) =>
        await computeTraveltime(await computeDuration(training)),
    ),
  );
}
