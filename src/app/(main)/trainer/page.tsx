import { notFound } from "next/navigation";

import { Breadcrumb, Breadcrumbs } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { auth } from "@/modules/auth/next-auth";
import { getMyTrainings } from "@/modules/trainers/queries";
import { CreateTraining } from "@/modules/trainings/components/CreateTraining";
import { TrainingList } from "@/modules/trainings/components/TrainingList";
import { getMyProfile } from "@/modules/users/queries";

export default async function Page() {
  const session = await auth();
  if (session?.user.role === "user") {
    return notFound();
  }
  const profile = await getMyProfile();
  const trainings = await getMyTrainings();

  return (
    <>
      <Breadcrumbs>
        <Breadcrumb href="/trainer">Meine Praktika</Breadcrumb>
      </Breadcrumbs>
      <div className="mx-auto max-w-2xl py-6">
        <PageTitle content="Hier findest du deine erstellten Praktika. Du kannst sehen wer angemeldet ist, kannst Praktika bearbeiten oder absagen.">
          Meine Praktika
        </PageTitle>
        <div className="my-4">
          <Stats trainings={trainings} />
        </div>
        <div className="my-4 flex items-center justify-end">
          <CreateTraining profile={profile} />
        </div>
        <div className="max-w-2xl">
          <TrainingList trainings={trainings} user={profile} />
        </div>
      </div>
    </>
  );
}

function Stats({
  trainings,
}: {
  trainings: {
    end: Date;
  }[];
}) {
  const trainingCount = trainings.length;

  if (trainingCount < 5) {
    return null;
  }

  return (
    <div className="inline-block rounded-lg bg-white p-4 text-sm text-muted-foreground shadow-lg">
      <p>
        ✨ Du hast bisher{" "}
        <span className="font-bold">{trainingCount} Praktika</span> eingetragen.
        Danke!
      </p>
    </div>
  );
}
