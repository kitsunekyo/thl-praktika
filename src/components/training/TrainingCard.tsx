import { Registration, Training, User } from "@prisma/client";
import { formatDuration, intervalToDuration } from "date-fns";
import { MapPinIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { formatTrainingDate, secondsToDuration } from "@/lib/date";
import { formatUserAddress } from "@/lib/user";
import { getInitials } from "@/lib/utils";

import { TrainingDate } from "./TrainingDate";
import { TrainingRegistrations } from "./TrainingRegistrations";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type TrainingWithMetadata = Training & {
  registrations: Registration[];
  author: Pick<
    User,
    "address" | "city" | "zipCode" | "id" | "email" | "image" | "name"
  >;
  traveltime?: number;
};

export async function TrainingCard({
  training,
  actions,
}: {
  training: TrainingWithMetadata;
  actions?: React.ReactNode;
}) {
  const address = formatUserAddress(training.author);
  const duration = formatDuration(
    intervalToDuration({ start: training.start, end: training.end }),
    {
      format: ["hours", "minutes"],
    },
  );

  return (
    <div className="rounded border border-solid bg-white text-sm">
      <header className="flex items-center border-b bg-gray-50 px-4 py-2">
        <div className="flex gap-2">
          <Avatar className="shrink-0 sm:hidden" size="sm">
            <AvatarImage src={training.author.image || "/img/avatar.jpg"} />
            <AvatarFallback>
              {getInitials({
                name: training.author.name,
                email: training.author.email,
              })}
            </AvatarFallback>
          </Avatar>
          <Avatar className="hidden shrink-0 sm:block">
            <AvatarImage src={training.author.image || "/img/avatar.jpg"} />
            <AvatarFallback>
              {getInitials({
                name: training.author.name,
                email: training.author.email,
              })}
            </AvatarFallback>
          </Avatar>
          <dl>
            <dd>{training.author.name || training.author.email}</dd>
            <dd className="text-xs text-muted-foreground">
              {formatTrainingDate(training.start, training.end)}
            </dd>
          </dl>
        </div>
        <div className="ml-auto hidden text-xs text-muted-foreground md:block">
          {duration}
        </div>
      </header>
      <dl className="space-y-2 p-4">
        {!!address && (
          <TrainingLocation
            address={address}
            customAddress={training.customAddress}
            traveltime={training.traveltime}
          />
        )}
        <dd>{training.description}</dd>
        <dd>
          <TrainingRegistrations
            count={training.registrations.length}
            max={training.maxInterns}
          />
        </dd>
      </dl>
      {!!actions && (
        <footer className="flex items-center gap-4 px-4 pb-4">{actions}</footer>
      )}
    </div>
  );
}

function TrainingLocation({
  address,
  customAddress,
  traveltime,
}: {
  address: string;
  customAddress?: boolean;
  traveltime?: number;
}) {
  const googleMapsUrl = `https://www.google.com/maps/place/${address.replaceAll(
    " ",
    "+",
  )}`;

  if (customAddress) {
    return (
      <span className="text-gray-400">
        Adresse wird persönlich bekannt gegeben
      </span>
    );
  }

  return (
    <div className="flex items-start gap-2 leading-none">
      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
      <div className="space-y-1">
        <Link
          href={googleMapsUrl}
          target="_blank"
          className="underline hover:no-underline"
        >
          {address}
        </Link>
        {!!traveltime && (
          <p className="text-xs">
            {formatDuration(secondsToDuration(traveltime), {
              format: ["hours", "minutes"],
            })}{" "}
            entfernt
          </p>
        )}
      </div>
    </div>
  );
}
