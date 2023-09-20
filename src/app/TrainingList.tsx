import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTrainingDate } from "@/lib/date";
import { getInitials } from "@/lib/utils";

import { getTrainnings } from "./register";
import { RegisterButton, UnregisterButton } from "./register-buttons";

export async function TrainingList() {
  const trainings = await getTrainnings();

  return (
    <section>
      <h1 className="mb-3 text-xl font-semibold">Praktika</h1>
      <p className="mb-8 max-w-[70ch] text-sm leading-[1.8] text-gray-500">
        Melde dich für Praktika bei THL Trainer:innen an.
      </p>
      <ul className="space-y-2">
        {trainings.map((training) => (
          <li
            key={training.id}
            className="rounded border border-solid p-4 text-sm"
          >
            <dl className="space-y-2">
              <dd>{training.description}</dd>
              <dd>
                {formatTrainingDate(
                  training.date,
                  training.startTime,
                  training.endTime,
                )}
              </dd>
              <dd>
                {training.registrations.length}/{training.maxInterns}{" "}
                Praktikanten angemeldet
              </dd>
            </dl>
            <footer className="mt-4 flex items-center gap-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={training.author.image || "/img/avatar.jpg"}
                  />
                  <AvatarFallback>
                    {getInitials(training.author)}
                  </AvatarFallback>
                </Avatar>
                <dd className="hidden md:block">{training.author.email}</dd>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {training.isRegistered ? (
                  <UnregisterButton trainingId={training.id} />
                ) : (
                  <RegisterButton trainingId={training.id} />
                )}
              </div>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
