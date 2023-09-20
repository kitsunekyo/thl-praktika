import { TrainingCard } from "@/components/TrainingCard";

import { getTrainnings } from "../register";
import { RegisterButton, UnregisterButton } from "../register-buttons";

export default async function Home() {
  return (
    <div className="mx-auto max-w-[600px]">
      <TrainingList />
    </div>
  );
}

async function TrainingList() {
  const trainings = await getTrainnings();

  return (
    <section>
      <h1 className="mb-3 text-xl font-semibold">Praktika</h1>
      <p className="mb-8 max-w-[70ch] text-sm leading-[1.8] text-gray-500">
        Melde dich für Praktika bei THL Trainer:innen an.
      </p>
      <ul className="space-y-2">
        {trainings.map((training) => (
          <li key={training.id}>
            <TrainingCard
              training={training}
              actions={
                training.isRegistered ? (
                  <UnregisterButton trainingId={training.id} />
                ) : training.maxInterns - training.registrations.length > 0 ? (
                  <RegisterButton trainingId={training.id} />
                ) : null
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
