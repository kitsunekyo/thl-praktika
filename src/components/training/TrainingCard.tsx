import { Registration, Training, User } from "@prisma/client";
import { formatDuration, intervalToDuration } from "date-fns";
import { MapPinIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { CollapsibleRegistrations } from "@/app/(main)/CollapsibleRegistrations";
import { formatTrainingDate, secondsToDuration } from "@/lib/date";
import { formatAddress } from "@/lib/user";
import { getInitials } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type TrainingWithMetadata = Training & {
  registrations: (Registration & {
    user: Pick<
      User,
      | "id"
      | "image"
      | "name"
      | "phone"
      | "email"
      | "address"
      | "city"
      | "zipCode"
    >;
  })[];
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
  const address = formatAddress({
    address: training.address,
    city: training.city,
    zipCode: training.zipCode,
  });
  const duration = formatDuration(
    intervalToDuration({ start: training.start, end: training.end }),
    {
      format: ["hours", "minutes"],
    },
  );

  return (
    <div className="rounded-xl border bg-white text-sm">
      <header className="flex items-start px-4 pt-4">
        <div className="flex gap-2">
          <Avatar className="shrink-0">
            <AvatarImage src={training.author.image || "/img/avatar.jpg"} />
            <AvatarFallback>
              {getInitials({
                name: training.author.name,
                email: training.author.email,
              })}
            </AvatarFallback>
          </Avatar>
          <dl>
            <dd className="font-medium">
              {training.author.name || training.author.email}
            </dd>
            <dd className="text-xs text-muted-foreground">
              {formatTrainingDate(training.start, training.end)}
            </dd>
          </dl>
        </div>
        <div className="ml-auto hidden text-xs text-muted-foreground md:block">
          {duration}
        </div>
      </header>
      <dl className="space-y-4 p-4">
        {training.description && <dd>{training.description}</dd>}
        {!!address && (
          <dd>
            <TrainingLocation
              location={address}
              traveltime={training.traveltime}
            />
          </dd>
        )}
        <dd>
          <CollapsibleRegistrations training={training} />
        </dd>
      </dl>
      {!!actions && (
        <footer className="flex items-center gap-4 px-4 pb-4">{actions}</footer>
      )}
    </div>
  );
}

function TrainingLocation({
  location,
  traveltime,
}: {
  location: string;
  traveltime?: number;
}) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.replaceAll(
    " ",
    "+",
  )}`;

  return (
    <div className="flex items-start gap-2 leading-none">
      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
      <div className="space-y-1">
        <Link
          href={googleMapsUrl}
          target="_blank"
          className="underline hover:no-underline"
        >
          {location}
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
