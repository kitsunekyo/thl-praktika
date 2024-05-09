import { notFound } from "next/navigation";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { AuthorizationError } from "@/lib/errors";
import { getMyTrainings } from "@/modules/trainers/queries";
import { CreateTraining } from "@/modules/trainings/components/CreateTraining";
import { TrainingList } from "@/modules/trainings/components/TrainingList";
import { getMyProfile } from "@/modules/users/queries";

export default async function Page() {
  const profile = await getMyProfile();
  if (!profile) {
    throw new AuthorizationError();
  }
  if (profile.role === "user") {
    return notFound();
  }

  const trainings = await getMyTrainings();

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/trainer">Meine Praktika</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle content="Hier findest du deine erstellten Praktika. Du kannst sehen wer angemeldet ist, kannst Praktika bearbeiten oder absagen.">
          Meine Praktika
        </PageTitle>
        <div className="space-y-4">
          <Stats trainings={trainings} />
          <CreateTraining profile={profile} />
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
