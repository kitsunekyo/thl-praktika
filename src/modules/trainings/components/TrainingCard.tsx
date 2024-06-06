"use client";

import { Registration, Training } from "@prisma/client";
import Link from "next/link";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { wrapLinksWithTags } from "@/lib/content";
import { formatAT } from "@/lib/date";
import { PublicUser } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { getInitials } from "@/modules/users/name";

import { CancelTraining } from "./CancelTraining";
import { EditTraining } from "./EditTraining";
import { Register } from "./Register";
import { RegisteredUsers } from "./RegisteredUsers";
import { TrainingDatetime } from "./TrainingDatetime";
import { TrainingLocation } from "./TrainingLocation";
import { Unregister } from "./Unregister";

export interface TrainingWithMetadata extends Training {
  registrations: (Registration & {
    user: Pick<PublicUser, "id" | "image" | "name">;
  })[];
  author: Pick<PublicUser, "id" | "email" | "image" | "name">;
  traveltime?: number;
}

export function TrainingCard({
  training,
  user,
}: {
  training: TrainingWithMetadata;
  user: Pick<PublicUser, "id" | "role">;
}) {
  const hasFreeSpots = training.maxInterns - training.registrations.length > 0;
  const isOwner = training.authorId === user.id;
  const isRegistered = training.registrations.some((r) => r.userId === user.id);
  const isPast = training.end < new Date();
  const isCancelled = training.cancelledAt !== null;
  const canRegister = !isOwner && hasFreeSpots && !isRegistered;
  const address = training.address;

  let actions = null;
  if (user.role === "trainer" && isOwner && !isPast && !isCancelled) {
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
  if (user.role === "user" && isRegistered && !isPast && !isCancelled) {
    actions = <Unregister trainingId={training.id} />;
  }
  if (user.role === "user" && canRegister && !isPast && !isCancelled) {
    actions = <Register trainingId={training.id} />;
  }

  return (
    <article
      className={cn("overflow-hidden rounded-xl bg-white text-sm shadow-lg", {
        "opacity-60": isCancelled,
      })}
    >
      <div className="flex">
        <div className="flex flex-col items-center gap-2 border-r border-gray-100 px-3 py-4">
          <Link href={`/profile/${training.author.id}`} className="shrink-0">
            <Avatar size="sm">
              <AvatarImage src={training.author.image || "/img/avatar.jpg"} />
              <AvatarFallback>
                {getInitials(training.author.name)}
              </AvatarFallback>
            </Avatar>
          </Link>
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
              className="text-lg font-bold leading-none"
            >
              {training.start.toLocaleString("de-AT", {
                day: "2-digit",
              })}
            </time>
          </div>
        </div>
        <div className="min-w-0 grow px-3 py-6">
          {training.cancelledAt && (
            <Badge variant="destructive" className="mb-3">
              Abgesagt
            </Badge>
          )}
          <Link
            href={`/profile/${training.author.id}`}
            className="mb-3 flex items-center gap-2 font-semibold hover:underline"
          >
            {training.author.name}
          </Link>
          <ul className="mb-4 space-y-2">
            <li>
              <TrainingDatetime start={training.start} end={training.end} />
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
              <li className="break-words">
                {wrapLinksWithTags(training.description)}
              </li>
            )}
          </ul>
          <RegisteredUsers training={training} />
          {!!actions && (
            <footer className="mt-2 flex items-center justify-end gap-2">
              {actions}
            </footer>
          )}
        </div>
      </div>
    </article>
  );
}
