import { Registration, Training, User } from "@prisma/client";
import { UserCheckIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { RegisterButton, UnregisterButton } from "@/app/register-buttons";
import { formatTrainingDate } from "@/lib/date";
import { getInitials, range } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export function TrainingCard({
  training,
  actions,
}: {
  training: Training & {
    registrations: Registration[];
    author: User;
  };
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded border border-solid p-4 text-sm">
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
            <AvatarImage src={training.author.image || "/img/avatar.jpg"} />
            <AvatarFallback>{getInitials(training.author)}</AvatarFallback>
          </Avatar>
          <dd className="hidden text-xs md:block">
            {!!training.author.name && (
              <p className="font-medium">{training.author.name}</p>
            )}
            <p>{training.author.email}</p>
          </dd>
        </div>
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </footer>
    </div>
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
        <Badge className="ml-2">
          {training.registrations.length}/{training.maxInterns} angemeldet
        </Badge>
      ) : (
        <Badge className="ml-2" variant="secondary">
          voll
        </Badge>
      )}
    </div>
  );
}

function getAddress(user: User) {
  return [user.address, [user.zipCode, user.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}
