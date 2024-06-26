import { differenceInDays, formatDistance } from "date-fns";
import { MapPinIcon } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { HelpLink } from "@/components/HelpLink";
import { PageTitle } from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizePhoneNumber } from "@/lib/utils";
import { getServerSession } from "@/modules/auth/next-auth";
import { TrainerMenu } from "@/modules/trainers/components/TrainerMenu";
import {
  getInvitedTrainers,
  getTrainers,
  getTrainingRequests,
} from "@/modules/trainers/queries";
import { RequestTrainingDialog } from "@/modules/trainings/components/RequestTrainingDialog";
import { getInitials } from "@/modules/users/name";

const REQUEST_COOLDOWN_IN_DAYS = 7;

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/trainers">Trainer:innen</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle
          content={
            <>
              <p>
                Hier findest du alle Trainer:innen, die auf der App registriert
                sind. Du kannst Praktika anfragen, oder direkt über Telefon oder
                E-Mail Kontakt aufnehmen.
              </p>
              <HelpLink href="/help/send-requests">Wie funktionierts?</HelpLink>
            </>
          }
        >
          Trainer:innen
        </PageTitle>
        <div className="max-w-4xl">
          <TrainerList />
          <div className="my-8" />
          {session.user.role === "user" && (
            <>
              <h3 className="mb-4 font-semibold">
                Unbeantwortete Praktika Anfragen
              </h3>
              <SentTrainingRequests />
            </>
          )}
        </div>
      </div>
    </>
  );
}

async function TrainerList() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const trainers = await getTrainers();
  const invitedTrainers = await getInvitedTrainers();
  const myRequests = await getTrainingRequests({ userId: session.user.id });

  return (
    <div>
      <ul role="list" className="divide-y divide-gray-100">
        {trainers.map((trainer) => {
          const isOnCooldown = Boolean(
            myRequests
              .filter((r) => r.trainerId === trainer.id)
              .find(
                (r) =>
                  differenceInDays(new Date(), new Date(r.createdAt)) <
                  REQUEST_COOLDOWN_IN_DAYS,
              ),
          );

          return (
            <li
              key={trainer.email}
              className="flex justify-between gap-x-6 py-5"
            >
              <div className="flex min-w-0 items-start gap-x-4">
                <Link
                  href={`/profile/${trainer.id}`}
                  className="shrink-0 leading-[0]"
                >
                  <Avatar size="lg">
                    <AvatarImage src={trainer.image || "/img/avatar.jpg"} />
                    <AvatarFallback>{getInitials(trainer.name)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <Link
                      href={`/profile/${trainer.id}`}
                      className="hover:underline"
                    >
                      {trainer.name}
                    </Link>
                  </p>
                  <div className="mt-1 flex text-xs leading-5 text-gray-500">
                    <a
                      href={`mailto:${trainer.email}`}
                      className="min-w-0 truncate hover:underline md:max-w-64"
                    >
                      {trainer.email}
                    </a>
                    {!!trainer.phone && (
                      <div className="min-w-0 shrink-0 truncate">
                        <span className="mx-2">•</span>
                        <a
                          href={`https://wa.me/${normalizePhoneNumber(trainer.phone)}`}
                          className="hover:underline"
                        >
                          {trainer.phone}
                        </a>
                      </div>
                    )}
                    {!!trainer.address && (
                      <div className="hidden min-w-0 items-center md:flex">
                        <span className="mx-2">•</span>
                        <MapPinIcon className="h-3 w-3 shrink-0" />
                        <p className="ml-1 truncate">{trainer.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  {session.user.role === "user" ? (
                    !isOnCooldown ? (
                      <RequestTrainingDialog trainerId={trainer.id}>
                        <Button size="sm" variant="outline">
                          Praktikum anfragen
                        </Button>
                      </RequestTrainingDialog>
                    ) : (
                      <div className="text-sm font-medium text-muted-foreground">
                        Anfrage gesendet
                      </div>
                    )
                  ) : null}
                </div>
                <TrainerMenu
                  trainerId={trainer.id}
                  isRequestCooldown={isOnCooldown}
                  userRole={session.user.role}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <h2 className="mb-3 mt-6 text-lg font-medium">
        Eingeladene Trainer:innen
      </h2>
      <p className="mb-3 space-y-2 text-sm text-muted-foreground">
        Diese Trainer:innen haben eine Einladung erhalten, aber haben sich nicht
        auf der App registriert. Du kannst per Telefon oder E-Mail um Praktika
        Möglichkeiten anfragen.
      </p>
      <ul role="list" className="divide-y divide-gray-100">
        {invitedTrainers.map((invitation) => (
          <li
            key={invitation.email}
            className="flex justify-between gap-x-6 py-5"
          >
            <div className="flex min-w-0 items-start gap-x-4">
              <Link
                href={`/trainers/invitations/${invitation.id}`}
                className="shrink-0 leading-[0]"
              >
                <Avatar size="lg">
                  <AvatarImage src="/img/avatar.jpg" />
                  <AvatarFallback>
                    {getInitials(invitation.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <Link
                    href={`/trainers/invitations/${invitation.id}`}
                    className="hover:underline"
                  >
                    {invitation.name}
                  </Link>
                </p>
                <div className="mt-1 flex text-xs leading-5 text-gray-500">
                  <a
                    href={`mailto:${invitation.email}`}
                    className="min-w-0 truncate hover:underline md:max-w-64"
                  >
                    {invitation.email}
                  </a>
                  {!!invitation.phone && (
                    <div className="min-w-0 shrink-0 truncate">
                      <span className="mx-2">•</span>
                      <a
                        href={`https://wa.me/${normalizePhoneNumber(invitation.phone)}`}
                        className="hover:underline"
                      >
                        {invitation.phone}
                      </a>
                    </div>
                  )}
                  {!!invitation.address && (
                    <div className="hidden min-w-0 items-center md:flex">
                      <span className="mx-2">•</span>
                      <MapPinIcon className="h-3 w-3 shrink-0" />
                      <p className="ml-1 truncate">{invitation.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function SentTrainingRequests() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const requests = await getTrainingRequests({ userId: session.user.id });

  if (!requests?.length) {
    return (
      <p className="text-sm text-gray-400">
        Du hast noch keine Praktika Anfragen gesendet.
      </p>
    );
  }

  // TODO: delete disabled to prevent email spam until i have an idea how to solve this

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trainer:in</TableHead>
            <TableHead className="hidden md:block"></TableHead>
            <TableHead className="text-right">gesendet</TableHead>
            {/* <TableHead className="w-[50px] text-right"></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="max-w-[80px] truncate md:max-w-xs">
                  {request.trainer.name}
                </div>
              </TableCell>
              <TableCell className="hidden md:block">
                <div className="max-w-[80px] truncate md:max-w-xs">
                  {request.trainer.email}
                </div>
              </TableCell>
              <TableCell className="text-right">
                vor {formatDistance(request.createdAt, new Date())}
              </TableCell>
              {/* <TableCell className="text-right">
              <DeleteButton requestId={request.id} />
            </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
