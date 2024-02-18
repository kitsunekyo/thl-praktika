import { Registration, Training, User } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import { getServerSession } from "@/modules/auth/getServerSession";
import { CreateTrainingButton } from "@/modules/trainings/components/CreateTrainingButton";
import {
  Register,
  Unregister,
} from "@/modules/trainings/components/register-buttons";
import { TrainingActions } from "@/modules/trainings/components/TrainingActions";
import { TrainingCard } from "@/modules/trainings/components/TrainingCard";
import { TrainingFilter } from "@/modules/trainings/components/TrainingFilter";
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

  const trainings = await getTrainings();
  const filteredTrainings = await filter({
    trainings: await addMetadata(trainings),
    filter: {
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
    },
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
        <div className="sticky top-0 py-4 md:py-6">
          <TrainingFilter hasAddress={userHasAddress} />
        </div>
      </aside>
      <main className="mb-6 md:w-full md:max-w-[600px] md:py-6">
        {isTrainer && (
          <div className="mb-8 ">
            <CreateTrainingButton profile={profile} />
          </div>
        )}
        <p className="mb-4 text-sm text-muted-foreground">
          {trainingsCountLabel}
        </p>
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
                          <TrainingActions
                            training={t}
                            id={t.id}
                            hasRegistrations={hasRegistrations}
                          />
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
