import { Registration, Training, User } from "@prisma/client";
import {
  formatDistance,
  formatDistanceStrict,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { UserCheckIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { getMe } from "@/app/(main)/profile/actions";
import { formatTrainingDate } from "@/lib/date";
import { getDirections } from "@/lib/mapquest";
import { getInitials, range } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

async function getDistanceToUser(
  user: Pick<User, "address" | "city" | "zipCode">,
) {
  const me = await getMe();
  if (!me) {
    return;
  }
  const myAddress = getAddress(me);
  const userAddress = getAddress(user);

  if (!myAddress || !userAddress) {
    return;
  }

  if (process.env.NODE_ENV === "development") {
    return { time: 90 * 60, formattedTime: "01:11:20" };
  }

  const directions = await getDirections(getAddress(me), getAddress(user));

  return {
    time: directions.route.time,
    formattedTime: directions.route.formattedTime,
  };
}

function secondsToDuration(seconds: number): Duration {
  const epoch = new Date(0);
  const secondsAfterEpoch = new Date(seconds * 1000);
  return intervalToDuration({
    start: epoch,
    end: secondsAfterEpoch,
  });
}

export async function TrainingCard({
  training,
  actions,
}: {
  training: Training & {
    registrations: Registration[];
    author: User;
  };
  actions?: React.ReactNode;
}) {
  const travelTime = await getDistanceToUser(training.author);
  console.log({ travelTime });

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
              {!!travelTime && (
                <p className="text-xs">
                  {formatDuration(secondsToDuration(travelTime.time))} entfernt
                </p>
              )}
            </div>
          )}
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

function getAddress(user: Pick<User, "address" | "city" | "zipCode">) {
  return [user.address, [user.zipCode, user.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}
