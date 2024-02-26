import { Registration, Training, User } from "@prisma/client";
import { formatDuration, intervalToDuration } from "date-fns";
import { ExternalLinkIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { secondsToDuration } from "@/lib/date";
import { formatAddress } from "@/modules/users/address";
import { getInitials } from "@/modules/users/name";

import { RegisteredUsers } from "./RegisteredUsers";
import { TrainingDate } from "./TrainingDate";

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
    <div className="rounded-xl bg-white text-sm shadow-lg">
      <header className="flex items-start px-4 pt-4">
        <Link href={`/profile/${training.author.id}`}>
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
                <TrainingDate start={training.start} end={training.end} />
              </dd>
            </dl>
          </div>
        </Link>
        <div className="ml-auto hidden text-xs text-muted-foreground md:block">
          {duration}
        </div>
      </header>
      <dl className="space-y-4 p-4">
        {training.description && <dd>{training.description}</dd>}
        {!!address && (
          <dd>
            <TrainingLocation
              address={address}
              traveltime={training.traveltime}
            />
          </dd>
        )}
        <dd>
          <RegisteredUsers training={training} />
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
  traveltime,
}: {
  address: string;
  traveltime?: number;
}) {
  let parts = address.split(/(https:\/\/maps.app.goo.gl\/\w*)/gi);
  const addressContent = parts.filter(Boolean).map((p, i) => {
    if (p.match(/(https:\/\/maps.app.goo.gl\/\w*)/gi)) {
      return (
        <a
          key={p + i}
          href={p}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline"
        >
          Google maps
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      );
    }
    return p;
  });

  return (
    <div className="flex items-start gap-2 leading-none">
      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
      <div className="space-y-1">
        {addressContent}
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
