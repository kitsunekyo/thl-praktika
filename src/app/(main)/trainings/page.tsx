import { Registration, Training, User } from "@prisma/client";
import Link from "next/link";

import { getMyTrainings } from "@/app/register";
import { PageTitle } from "@/components/PageTitle";
import { TrainingCard } from "@/components/training/TrainingCard";

import { computeDuration, computeTraveltime } from "../../../lib/training";
import { UnregisterButton } from "../register-buttons";

export default async function Trainings() {
  const trainings = await addMetadata(await getMyTrainings());

  return (
    <>
      <PageTitle>Meine Praktika Anmeldungen</PageTitle>
      {trainings.length > 0 ? (
        <TrainingList trainings={trainings} />
      ) : (
        <p className="text-muted-foreground">
          Du hast dich noch für keine Trainings als Praktikant:in angemeldet.
          <br />
          Suche nach passenden{" "}
          <Link href="/" className="underline">
            Praktika Möglichkeiten
          </Link>
        </p>
      )}
    </>
  );
}

function TrainingList({
  trainings,
}: {
  trainings: (Training & {
    author: Omit<User, "password">;
    registrations: Registration[];
  })[];
}) {
  return (
    <ul className="max-w-2xl space-y-4">
      {trainings.map((t) => {
        return (
          <li key={t.id}>
            <TrainingCard
              training={t}
              actions={<UnregisterButton trainingId={t.id} />}
            />
          </li>
        );
      })}
    </ul>
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
