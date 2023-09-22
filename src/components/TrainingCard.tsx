import { Registration, Training, User } from "@prisma/client";
import { formatDuration, intervalToDuration } from "date-fns";
import { UserCheckIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { getMe } from "@/app/(main)/profile/actions";
import {
  formatDurationShort,
  formatTrainingDate,
  secondsToDuration,
} from "@/lib/date";
import { getDirections } from "@/lib/mapquest";
import { cn, getInitials, range } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

async function getTraveltimeToUser(
  user: Pick<User, "id" | "address" | "city" | "zipCode">,
) {
  const me = await getMe();
  if (!me) {
    return;
  }
  if (me.id === user.id) {
    return;
  }
  const myAddress = getAddress(me);
  const userAddress = getAddress(user);

  if (!myAddress || !userAddress) {
    return;
  }

  if (process.env.NODE_ENV === "development") {
    return { time: 4855, formattedTime: "01:11:20" };
  }

  const directions = await getDirections(getAddress(me), getAddress(user));

  if (directions.info.statuscode !== 0) {
    return;
  }

  return {
    time: directions.route.time,
    formattedTime: formatDuration(secondsToDuration(directions.route.time), {
      format: ["hours", "minutes"],
    }),
  };
}
export async function TrainingCard({
  training,
  actions,
}: {
  training: Training & {
    registrations: Registration[];
    author: Omit<User, "password">;
    duration: number;
  };
  actions?: React.ReactNode;
}) {
  const isPast = training.date < new Date();
  const distance = await getTraveltimeToUser(training.author);

  return (
    <div
      className={cn("rounded border border-solid p-4 text-sm", {
        "opacity-50": isPast,
      })}
    >
      <dl className="space-y-2">
        <dd className="font-medium">{training.description}</dd>
        <dd>
          {formatTrainingDate(
            training.date,
            training.startTime,
            training.endTime,
          )}{" "}
          ({formatDurationShort(training.duration)})
        </dd>
        <dd>
          {training.customAddress ? (
            <span className="text-gray-400">
              Adresse wird persönlich bekannt gegeben
            </span>
          ) : (
            <div>
              <Link
                href={`https://www.google.com/maps/place/${getAddress(
                  training.author,
                ).replaceAll(" ", "+")}`}
                target="_blank"
                className="underline hover:no-underline"
              >
                {getAddress(training.author)}{" "}
              </Link>
              {!!distance && (
                <p className="text-xs">{distance.formattedTime} entfernt</p>
              )}
            </div>
          )}
        </dd>
        <dd>
          <RegistrationStatus training={training} />
        </dd>
      </dl>
      <footer className="mt-4 flex items-center gap-4 border-t pt-4">
        <div className="flex min-w-0 shrink items-center gap-2">
          <Avatar>
            <AvatarImage src={training.author.image || "/img/avatar.jpg"} />
            <AvatarFallback>{getInitials(training.author)}</AvatarFallback>
          </Avatar>
          <dd className="min-w-0 shrink text-xs">
            {!!training.author.name && (
              <p className="truncate font-medium">{training.author.name}</p>
            )}
            <p className="truncate">{training.author.email}</p>
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

function getAddress(user: Pick<User, "address" | "city" | "zipCode">) {
  return [user.address, [user.zipCode, user.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}
