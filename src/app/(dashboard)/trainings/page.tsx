import { Training, User } from "@prisma/client";
import Link from "next/link";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { SafeUser } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/next-auth";
import { TrainingList } from "@/modules/trainings/components/TrainingList";
import {
  computeDuration,
  computeTraveltime,
} from "@/modules/trainings/compute-data";
import { getMyTrainings } from "@/modules/trainings/queries";

export default async function Trainings() {
  const trainings = await addMetadata(await getMyTrainings());
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/trainings">
          Meine Praktika Anmeldungen
        </BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle content="Deine Anmeldungen für Praktika.">
          Anmeldungen
        </PageTitle>
        <div className="my-2">
          <Stats trainings={trainings} />
        </div>
        {trainings.length > 0 ? (
          <TrainingList trainings={trainings} user={session.user} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Du hast dich noch für keine Praktika angemeldet.
            <br />
            Suche nach passenden{" "}
            <Link href="/" className="underline">
              Praktika Möglichkeiten
            </Link>
          </p>
        )}
      </div>
    </>
  );
}

async function addMetadata<
  T extends Training & {
    author: SafeUser;
  },
>(trainings: T[]) {
  return Promise.all(
    trainings.map(async (training) => {
      return await computeTraveltime(await computeDuration(training));
    }),
  );
}

function Stats({
  trainings,
}: {
  trainings: {
    end: Date;
    duration: number;
  }[];
}) {
  const previousTrainings = trainings.filter((t) => t.end > new Date());
  const trainingCount = previousTrainings.length;
  const totalHours = previousTrainings.reduce(
    (total, training) => total + training.duration / (1000 * 60 * 60),
    0,
  );

  if (trainingCount < 5 || totalHours < 5) {
    return null;
  }

  return (
    <div className="inline-block max-w-2xl rounded-lg bg-white p-4 text-sm shadow-lg">
      <p>
        ✨ Du hast dich bisher für{" "}
        <span className="font-bold">{trainingCount} Praktika</span> angemeldet
        und <span className="font-bold">{totalHours} Stunden</span> über die App
        abgeschlossen.
      </p>
    </div>
  );
}
