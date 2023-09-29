import { Registration, Training, User } from "@prisma/client";
import { formatDuration } from "date-fns";
import Link from "next/link";
import React from "react";

import { secondsToDuration } from "@/lib/date";
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
  return (
    <div className="rounded border border-solid bg-white text-sm">
      <header className="border-b bg-gray-50 px-4 py-2">
        <TrainingDate start={training.start} end={training.end} />
      </header>
      <dl className="space-y-2 p-4">
        <dd className="font-medium">{training.description}</dd>
        <dd>
          <TrainingLocation training={training} />
        </dd>
        <dd>
          <TrainingRegistrations
            count={training.registrations.length}
            max={training.maxInterns}
          />
        </dd>
      </dl>
      <footer className="flex items-center gap-4 px-4 pb-4">
        <TrainingAuthor
          name={training.author.name}
          email={training.author.email}
          image={training.author.image}
        />
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </footer>
    </div>
  );
}

function TrainingAuthor({
  name,
  email,
  image,
}: {
  name: string | null;
  email: string;
  image: string | null;
}) {
  return (
    <div className="flex min-w-0 shrink items-center gap-2">
      <Avatar>
        <AvatarImage src={image || "/img/avatar.jpg"} />
        <AvatarFallback>{getInitials({ name, email })}</AvatarFallback>
      </Avatar>
      <dd className="min-w-0 shrink text-xs">
        {!!name && <p className="truncate font-medium">{name}</p>}
        <p className="truncate">{email}</p>
      </dd>
    </div>
  );
}

function TrainingLocation({ training }: { training: TrainingWithMetadata }) {
  const address = formatUserAddress(training.author);
  const googleMapsUrl = `https://www.google.com/maps/place/${address.replaceAll(
    " ",
    "+",
  )}`;

  if (training.customAddress) {
    return (
      <span className="text-gray-400">
        Adresse wird persönlich bekannt gegeben
      </span>
    );
  }

  return (
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
          {formatDuration(secondsToDuration(training.traveltime), {
            format: ["hours", "minutes"],
          })}{" "}
          entfernt
        </p>
      )}
    </div>
  );
}
