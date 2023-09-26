import { addDays, endOfDay, format, startOfDay } from "date-fns";

import { PageTitle } from "@/components/PageTitle";
import { TrainingCard } from "@/components/TrainingCard";
import { getServerSession } from "@/lib/next-auth";

import { RegisterButton, UnregisterButton } from "./register-buttons";
import {
  computeDuration,
  computeIsRegistered,
  computeTraveltime,
} from "./training";
import { TrainingFilter } from "../../components/TrainingFilter";
import { getTrainings } from "../register";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerSession();
  const isTrainer = session?.user.role === "trainer";

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
  if (filteredTrainings.length === 0) {
    trainingsCountLabel = "Kein Training gefunden";
  } else {
    trainingsCountLabel = `${filteredTrainings.length} Trainings gefunden`;
  }

  return (
    <section>
      <div className="gap-8 md:flex">
        <aside className="relative mb-8 shrink-0 basis-80">
          <div className="sticky top-12">
            <PageTitle>Praktika</PageTitle>
            <TrainingFilter />
          </div>
        </aside>
        <div className="md:w-full md:max-w-[600px]">
          <p className="mb-4 text-sm text-muted-foreground">
            {trainingsCountLabel}
          </p>
          {filteredTrainings.length > 0 && (
            <ul className="space-y-4">
              {filteredTrainings.map((t) => {
                const hasFreeSpots = t.maxInterns - t.registrations.length > 0;
                return (
                  <li key={t.id}>
                    <TrainingCard
                      training={t}
                      actions={
                        isTrainer ? null : t.isRegistered ? (
                          <UnregisterButton trainingId={t.id} />
                        ) : (
                          hasFreeSpots && <RegisterButton trainingId={t.id} />
                        )
                      }
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

type TrainingsWithMetadata = Awaited<ReturnType<typeof addMetadata>>;
async function addMetadata(
  trainings: Awaited<ReturnType<typeof getTrainings>>,
) {
  return Promise.all(
    trainings.map(async (training) => {
      return await computeTraveltime(
        await computeIsRegistered(await computeDuration(training)),
      );
    }),
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
