import { Training, User } from "@prisma/client";
import Link from "next/link";

import { PageTitle } from "@/components/PageTitle";
import { getServerSession } from "@/modules/auth/getServerSession";
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

  const role = session.user.role;

  return (
    <div className="py-6">
      <PageTitle content="Deine Anmeldungen für Praktika.">
        Anmeldungen
      </PageTitle>
      <Stats trainings={trainings} />
      {trainings.length > 0 ? (
        <TrainingList trainings={trainings} role={role} />
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
  );
}

async function addMetadata<
  T extends Training & { author: Omit<User, "password"> },
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

  if (trainingCount === 0 || totalHours === 0) {
    return null;
  }

  return (
    <div className="text-sm text-muted-foreground">
      <p>
        Du hast dich bisher für{" "}
        <span className="font-bold">{trainingCount} Praktika</span> angemeldet.
      </p>
      <p>
        Du hast{" "}
        <span className="font-bold">{totalHours} Praktikumsstunden</span> über
        die App abgeschlossen. ✨
      </p>
    </div>
  );
}
