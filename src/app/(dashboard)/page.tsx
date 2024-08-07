import { Training } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { AuthorizationError } from "@/lib/errors";
import { CreateTraining } from "@/modules/trainings/components/CreateTraining";
import {
  Filter,
  TrainingFilter,
} from "@/modules/trainings/components/TrainingFilter";
import { TrainingList } from "@/modules/trainings/components/TrainingList";
import {
  WithDurationAndTraveltime,
  addMetadata,
} from "@/modules/trainings/compute-data";
import { getAvailableTrainings } from "@/modules/trainings/queries";
import { WithAuthor, WithRegistrations } from "@/modules/trainings/types";
import { getMyProfile } from "@/modules/users/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const profile = await getMyProfile();

  if (!profile) {
    throw new AuthorizationError();
  }

  const filter = getFilter(searchParams);
  const trainings = await getAvailableTrainings();
  const filteredTrainings = await filterTrainings({
    trainings: await addMetadata(trainings),
    filter,
  });

  const userHasAddress = Boolean(profile.address);

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem>Praktika Übersicht</BreadcrumbsItem>
      </Breadcrumbs>
      <section className="gap-8 md:flex md:pb-6">
        <aside className="relative shrink-0 basis-80">
          <div className="sticky top-0">
            <TrainingFilter hasAddress={userHasAddress} value={filter} />
          </div>
        </aside>
        <div className="mb-6 w-full space-y-4 md:py-6">
          <header className="max-w-2xl divide-y rounded-xl bg-white shadow-lg">
            <h1 className="p-4 text-sm font-semibold">
              Bevorstehende Praktika
            </h1>
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
          </header>
          <TrainingList trainings={filteredTrainings} user={profile} />
        </div>
      </section>
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

interface TrainingsWithMetadata
  extends WithDurationAndTraveltime<
    Training & WithRegistrations & WithAuthor
  > {}

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
        `${t.author.name} ${t.author.email} ${t.description} ${t.address}`.toLowerCase();
      if (haystack.includes(filter.search.toLowerCase())) {
        return true;
      }
      return false;
    }
    return true;
  });
}
