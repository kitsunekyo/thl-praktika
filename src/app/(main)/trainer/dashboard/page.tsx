import { PageTitle } from "@/components/PageTitle";
import { TrainingCard } from "@/components/TrainingCard";

import { getMyTrainings } from "./actions";
import { TrainingForm } from "./TrainingForm";
import { TrainingListActions } from "./TrainingListActions";

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
          <h2 className="mb-6 text-xl font-semibold">Geplante Trainings</h2>
          {trainings.length === 0 && (
            <p className="text-sm text-gray-500">
              Du hast noch keine Trainings eingetragen.
            </p>
          )}
          <ul className="space-y-4">
            {trainings.map((training) => (
              <li key={training.id}>
                <TrainingCard
                  training={training}
                  actions={
                    <TrainingListActions id={training.id} key={training.id} />
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
