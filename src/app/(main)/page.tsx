import { Registration, Training, User } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import { getServerSession } from "@/modules/auth/getServerSession";
import { CancelTraining } from "@/modules/trainings/components/CancelTraining";
import { CreateTraining } from "@/modules/trainings/components/CreateTraining";
import { EditTraining } from "@/modules/trainings/components/EditTraining";
import { Register } from "@/modules/trainings/components/Register";
import { TrainingCard } from "@/modules/trainings/components/TrainingCard";
import { TrainingFilter } from "@/modules/trainings/components/TrainingFilter";
import { Unregister } from "@/modules/trainings/components/Unregister";
import {
  computeDuration,
  computeIsRegistered,
  computeTraveltime,
} from "@/modules/trainings/compute-data";
import { getTrainings } from "@/modules/trainings/queries";
import { getProfile } from "@/modules/users/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerSession();
  const profile = await getProfile();
  const isTrainer = session?.user.role !== "user";

  if (!profile) {
    return null;
  }

  const filterValue = {
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
  };

  const trainings = await getTrainings();
  const filteredTrainings = await filter({
    trainings: await addMetadata(trainings),
    filter: filterValue,
  });

  let trainingsCountLabel: string;
  if (filteredTrainings.length === trainings.length) {
    trainingsCountLabel = `${filteredTrainings.length} Praktika`;
  } else {
    trainingsCountLabel = `${filteredTrainings.length} von ${trainings.length} Praktika`;
  }

  const userHasAddress = Boolean(
    profile.address || profile.zipCode || profile.city,
  );

  return (
    <section className="gap-8 md:flex md:py-6">
      <aside className="relative shrink-0 basis-80">
        <div className="sticky top-0">
          <TrainingFilter hasAddress={userHasAddress} value={filterValue} />
        </div>
      </aside>
      <main className="mb-6 md:w-full md:max-w-[600px] md:py-6">
        <div className="mb-4 divide-y rounded-xl bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-lg font-medium">Bevorstehende Praktika</h2>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="text-sm text-muted-foreground">
              {trainingsCountLabel}
            </p>
            {isTrainer && (
              <div className="ml-auto">
                <CreateTraining profile={profile} />
              </div>
            )}
          </div>
        </div>
        {trainings.length === 0 && <NoTrainings />}
        {filteredTrainings.length > 0 && (
          <ul className="space-y-4">
            {filteredTrainings.map((t) => {
              const hasFreeSpots = t.maxInterns - t.registrations.length > 0;
              const isOwner = t.authorId === session?.user.id;
              const canRegister = !isOwner && hasFreeSpots;
              const hasRegistrations = Boolean(t.registrations.length);

              if (isTrainer) {
                return (
                  <li key={t.id}>
                    <TrainingCard
                      training={t}
                      actions={
                        isOwner && (
                          <>
                            <EditTraining training={t} />
                            <CancelTraining
                              trainingId={t.id}
                              hasRegistrations={hasRegistrations}
                            />
                          </>
                        )
                      }
                    />
                  </li>
                );
              }

              return (
                <li key={t.id}>
                  <TrainingCard
                    training={t}
                    actions={
                      t.isRegistered ? (
                        <Unregister trainingId={t.id} />
                      ) : (
                        canRegister && <Register trainingId={t.id} />
                      )
                    }
                  />
                </li>
              );
            })}
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

async function filter({
  trainings,
  filter,
}: {
  trainings: TrainingsWithMetadata;
  filter: {
    traveltime: number;
    duration: number /* in hours */;
    free: number;
    from?: Date;
    to?: Date;
  };
}) {
  const { traveltime, duration, free } = filter;

  return trainings.filter((t) => {
    if (!Number.isNaN(duration) && t.duration < duration * 3600000) {
      return false;
    }
    if (!Number.isNaN(free) && t.maxInterns - t.registrations.length < free) {
      return false;
    }
    if (
      !Number.isNaN(traveltime) &&
      t.traveltime !== undefined &&
      t.traveltime > traveltime * 60
    ) {
      return false;
    }
    if (filter.from && t.start < filter.from) {
      return false;
    }
    if (filter.to && t.end >= filter.to) {
      return false;
    }
    return true;
  });
}

type TrainingsWithMetadata = Awaited<ReturnType<typeof addMetadata>>;
async function addMetadata<
  T extends Training & {
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
  },
>(trainings: T[]) {
  return Promise.all(
    trainings.map(async (training) => {
      return await computeTraveltime(
        await computeIsRegistered(await computeDuration(training)),
      );
    }),
  );
}
