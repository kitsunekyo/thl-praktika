import { differenceInDays, formatDistance } from "date-fns";
import { MapPinIcon } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
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
import { getServerSession } from "@/modules/auth/next-auth";
import { TrainerMenu } from "@/modules/trainers/components/TrainerMenu";
import { getTrainers, getTrainingRequests } from "@/modules/trainers/queries";
import { RequestTraining } from "@/modules/trainings/components/RequestTraining";
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
              Sende Praktika Anfragen an Trainer:innen. Sie erhalten eine
              Benachrichtigung mit der Bitte Praktika einzutragen.
            </>
          }
        >
          Trainer:innen
        </PageTitle>
        <div className="max-w-6xl">
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
  const myRequests = await getTrainingRequests({ userId: session.user.id });

  return (
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
          <li key={trainer.email} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 items-start gap-x-4">
              <Link
                href={`/profile/${trainer.id}`}
                className="shrink-0 leading-[0]"
              >
                <Avatar size="lg">
                  <AvatarImage src={trainer.image || "/img/avatar.jpg"} />
                  <AvatarFallback>
                    {getInitials({ name: trainer.name })}
                  </AvatarFallback>
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
                        href={`tel:${trainer.phone}`}
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
                {session.user.role !== "trainer" && (
                  <RequestTraining
                    trainerId={trainer.id}
                    disabled={isOnCooldown}
                  >
                    <Button size="sm" variant="outline">
                      Praktikum anfragen
                    </Button>
                  </RequestTraining>
                )}
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
