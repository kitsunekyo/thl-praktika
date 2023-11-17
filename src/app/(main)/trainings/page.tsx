import { Registration, Training, User } from "@prisma/client";
import Link from "next/link";

import { getMyTrainings } from "@/app/(main)/trainings/actions";
import { PageTitle } from "@/components/PageTitle";
import { UnregisterButton } from "@/components/training/register-buttons";
import { TrainingCard } from "@/components/training/TrainingCard";
import { Separator } from "@/components/ui/separator";
import { computeDuration, computeTraveltime } from "@/lib/training";

export const dynamic = "force-dynamic";

export default async function Trainings() {
  const trainings = await addMetadata(await getMyTrainings());

  return (
    <div className="py-6">
      <PageTitle content="Deine Anmeldungen für Praktika.">
        Anmeldungen
      </PageTitle>
      <Separator className="my-4" />
      {trainings.length > 0 ? (
        <TrainingList trainings={trainings} />
      ) : (
        <p className="text-muted-foreground">
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

function TrainingList({
  trainings,
}: {
  trainings: (Training & {
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
