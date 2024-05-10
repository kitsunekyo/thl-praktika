"use client";

import { Registration, Training, User } from "@prisma/client";
import { formatDuration } from "date-fns";
import { ExternalLinkIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { secondsToDuration } from "@/lib/date";
import { SafeUser } from "@/lib/prisma";
import { getInitials } from "@/modules/users/name";

import { CancelTraining } from "./CancelTraining";
import { EditTraining } from "./EditTraining";
import { Register } from "./Register";
import { RegisteredUsers } from "./RegisteredUsers";
import { TrainingTime } from "./TrainingTime";
import { Unregister } from "./Unregister";

export interface TrainingWithMetadata extends Training {
  registrations: (Registration & {
    user: Pick<SafeUser, "id" | "image" | "name">;
  })[];
  author: Pick<SafeUser, "id" | "email" | "image" | "name">;
  traveltime?: number;
}

export function TrainingCard({
  training,
  user,
}: {
  training: TrainingWithMetadata;
  user: Pick<SafeUser, "id" | "role">;
}) {
  const hasFreeSpots = training.maxInterns - training.registrations.length > 0;
  const isOwner = training.authorId === user.id;
  const isRegistered = training.registrations.some((r) => r.userId === user.id);
  const isPast = training.end < new Date();
  const canRegister = !isOwner && hasFreeSpots && !isRegistered;
  const address = training.address;

  let actions = null;
  if (user.role === "trainer" && isOwner && !isPast) {
    actions = (
      <>
        <EditTraining training={training} />
        <CancelTraining
          trainingId={training.id}
          hasRegistrations={Boolean(training.registrations.length)}
        />
      </>
    );
  }
  if (user.role === "user" && isRegistered && !isPast) {
    actions = <Unregister trainingId={training.id} />;
  }
  if (user.role === "user" && canRegister && !isPast) {
    actions = <Register trainingId={training.id} />;
  }

  return (
    <article className="overflow-hidden rounded-xl bg-white text-sm shadow-lg">
      <div className="flex">
        <div className="flex flex-col items-center gap-4 bg-gray-50 px-4 py-6">
          <Avatar className="shrink-0" size="sm">
            <AvatarImage src={training.author.image || "/img/avatar.jpg"} />
            <AvatarFallback>
              {getInitials({
                name: training.author.name,
                email: training.author.email,
              })}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-1">
            <time
              dateTime={training.start.toISOString()}
              className="font-medium leading-none"
            >
              {training.start.toLocaleString("de-AT", {
                weekday: "short",
              })}
            </time>
            <time
              dateTime={training.start.toISOString()}
              className="text-xl font-bold leading-none"
            >
              {training.start.toLocaleString("de-AT", {
                day: "2-digit",
              })}
            </time>
          </div>
        </div>
        <div className="grow px-4 py-6">
          <Link
            href={`/profile/${training.author.id}`}
            className="flex items-center gap-2 font-medium"
          >
            <h4 className="mb-3 font-semibold">
              {training.author.name || training.author.email}
            </h4>
          </Link>
          <ul className="space-y-2">
            <li>
              <TrainingTime start={training.start} end={training.end} />
            </li>
            {!!address && (
              <li>
                <TrainingLocation
                  address={address}
                  traveltime={training.traveltime}
                />
              </li>
            )}
            {training.description && (
              <li className="break-words">{training.description}</li>
            )}
            <li>
              <RegisteredUsers training={training} />
            </li>
          </ul>
          {!!actions && (
            <footer className="flex items-center justify-end gap-2">
              {actions}
            </footer>
          )}
        </div>
      </div>
    </article>
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
    <div className="flex items-start gap-2 font-medium leading-tight">
      <MapPinIcon className="h-4 w-4 shrink-0" />
      <div className="space-y-1 break-words">
        {addressContent}
        {!!traveltime && (
          <p className="text-xs font-normal">
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
