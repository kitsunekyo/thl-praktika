import { Registration, Training } from "@prisma/client";

import { PageTitle } from "@/components/PageTitle";
import { TrainingDate } from "@/components/training/TrainingDate";
import { TrainingRegistrations } from "@/components/training/TrainingRegistrations";

import { TrainingForm } from "./TrainingForm";
import { TrainingListActions } from "./TrainingListActions";
import { getMyTrainings } from "../actions";

export default async function Page() {
  const trainings = await getMyTrainings();

  return (
    <div>
      <PageTitle>Trainer Dashboard</PageTitle>
      <div className="gap-16 md:grid lg:grid-cols-[500px,1fr]">
        <div className="mb-10 md:mb-0">
          <h2 className="mb-3 text-xl font-semibold">Training erstellen</h2>
          <p className="mb-8 max-w-[70ch] text-sm leading-[1.8] text-gray-500">
            Du hast ein Training bei denen Praktikant:innen von THL dabei sein
            können? Trage es hier ein, damit sie sich dafür anmelden können.
          </p>
          <TrainingForm />
        </div>
        <section>
          <h2 className="mb-6 text-xl font-semibold">
            Deine geplanten Trainings
          </h2>
          {trainings.length === 0 && (
            <p className="text-sm text-gray-500">
              Du hast noch keine Trainings eingetragen.
            </p>
          )}
          <ul className="space-y-4">
            {trainings.map((training) => (
              <li key={training.id}>
                <TrainingItem training={training} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function TrainingItem({
  training,
}: {
  training: Training & {
    registrations: Registration[];
  };
}) {
  return (
    <div className="rounded border border-solid bg-white p-4 text-sm">
      <dl className="space-y-2">
        <dd className="font-medium">{training.description}</dd>
        <dd>
          <TrainingDate start={training.start} end={training.end} />
        </dd>
        <dd>
          <TrainingRegistrations
            count={training.registrations.length}
            max={training.maxInterns}
          />
        </dd>
      </dl>
      <footer className="mt-4 flex items-center gap-4 border-t pt-4">
        <TrainingListActions id={training.id} />
      </footer>
    </div>
  );
}
