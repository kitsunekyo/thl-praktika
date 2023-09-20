import { Registration, Training, User } from "@prisma/client";
import { UserCheckIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTrainingDate } from "@/lib/date";
import { getInitials, range } from "@/lib/utils";

import { getTrainnings } from "./register";
import { RegisterButton, UnregisterButton } from "./register-buttons";

function getAddress(user: User) {
  return [user.address, [user.zipCode, user.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

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
              <dd className="font-medium">{training.description}</dd>
              <dd>
                {formatTrainingDate(
                  training.date,
                  training.startTime,
                  training.endTime,
                )}
              </dd>
              <dd>
                <Link
                  href={`https://www.google.com/maps/place/${getAddress(
                    training.author,
                  ).replaceAll(" ", "+")}`}
                  target="_blank"
                  className="underline hover:no-underline"
                >
                  {getAddress(training.author)}
                </Link>
              </dd>
              <dd>
                <RegistrationStatus training={training} />
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
                <dd className="hidden text-xs md:block">
                  {!!training.author.name && (
                    <p className="font-medium">{training.author.name}</p>
                  )}
                  <p>{training.author.email}</p>
                </dd>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {training.isRegistered ? (
                  <UnregisterButton trainingId={training.id} />
                ) : training.maxInterns - training.registrations.length > 0 ? (
                  <RegisterButton trainingId={training.id} />
                ) : null}
              </div>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RegistrationStatus({
  training,
}: {
  training: Training & {
    registrations: Registration[];
  };
}) {
  const freeSpots = training.maxInterns - training.registrations.length;

  return (
    <div className="flex items-center">
      {range(training.registrations.length).map((i) => (
        <UserCheckIcon key={i} className="h-5 w-5" />
      ))}
      {range(freeSpots).map((i) => (
        <UserIcon key={i} className="h-5 w-5 text-gray-400" />
      ))}
      {freeSpots > 0 ? (
        <Badge className="ml-2" variant="secondary">
          {freeSpots}/{training.maxInterns} frei
        </Badge>
      ) : (
        <Badge className="ml-2" variant="destructive">
          voll
        </Badge>
      )}
    </div>
  );
}
