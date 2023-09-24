import { Registration, Training, User } from "@prisma/client";
import { formatDuration, intervalToDuration } from "date-fns";
import { UserCheckIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { formatDurationShort, formatTrainingDate } from "@/lib/date";
import { formatUserAddress } from "@/lib/user";
import { cn, getInitials, range } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export async function TrainingCard({
  training,
  actions,
}: {
  training: Training & {
    registrations: Registration[];
    author: Omit<User, "password">;
    duration: number; // in seconds
    traveltime?: {
      time: number;
      formattedTime: string;
    };
  };
  actions?: React.ReactNode;
}) {
  const hasEnded = training.end < new Date();
  const address = formatUserAddress(training.author);
  const googleMapsUrl = `https://www.google.com/maps/place/${address.replaceAll(
    " ",
    "+",
  )}`;

  const duration = formatDuration(
    intervalToDuration({ start: training.start, end: training.end }),
  );

  return (
    <div
      className={cn("rounded border border-solid bg-white p-4 text-sm", {
        "opacity-50": hasEnded,
      })}
    >
      <dl className="space-y-2">
        <dd className="font-medium">{training.description}</dd>
        <dd>
          {`${formatTrainingDate(training.start, training.end)} (${duration})`}
        </dd>
        <dd>
          {training.customAddress ? (
            <span className="text-gray-400">
              Adresse wird persönlich bekannt gegeben
            </span>
          ) : (
            <div>
              <Link
                href={googleMapsUrl}
                target="_blank"
                className="underline hover:no-underline"
              >
                {address}
              </Link>
              {!!training.traveltime && (
                <p className="text-xs">
                  {training.traveltime.formattedTime} entfernt
                </p>
              )}
            </div>
          )}
        </dd>
        <dd>
          <RegistrationStatus
            count={training.registrations.length}
            max={training.maxInterns}
          />
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

function RegistrationStatus({ count, max }: { count: number; max: number }) {
  const freeSpots = max - count;

  return (
    <div className="flex items-center">
      {range(count).map((i) => (
        <UserCheckIcon key={i} className="h-5 w-5" />
      ))}
      {range(freeSpots).map((i) => (
        <UserIcon key={i} className="h-5 w-5 text-gray-400" />
      ))}
      {freeSpots > 0 ? (
        <Badge className="ml-2">
          {count}/{max} angemeldet
        </Badge>
      ) : (
        <Badge className="ml-2" variant="secondary">
          voll
        </Badge>
      )}
    </div>
  );
}
