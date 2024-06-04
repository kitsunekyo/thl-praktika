import { differenceInDays, formatDistance } from "date-fns";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerSession } from "@/modules/auth/next-auth";
import { getTrainers, getTrainingRequests } from "@/modules/trainers/queries";
import { RequestTraining } from "@/modules/trainings/components/RequestTraining";
import { getInitials } from "@/modules/users/name";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const trainers = await getTrainers();
  const myRequests = await getTrainingRequests({ userId: session.user.id });

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
        <TrainerList trainers={trainers} requests={myRequests} />
        <div className="my-8" />
        {session.user.role === "user" && (
          <>
            <h2 className="mb-4 text-lg font-semibold">Gesendete Anfragen</h2>
            <SentTrainingRequests requests={myRequests} />
          </>
        )}
      </div>
    </>
  );
}

const REQUEST_COOLDOWN_IN_DAYS = 7;

async function TrainerList({
  trainers,
  requests,
}: {
  trainers: Awaited<ReturnType<typeof getTrainers>>;
  requests: Awaited<ReturnType<typeof getTrainingRequests>>;
}) {
  if (trainers.length === 0) {
    return (
      <p className="text-sm text-gray-400">Keine Trainer:innen verfügbar.</p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {trainers.map((trainer) => (
        <TrainerCard
          key={trainer.id}
          trainer={trainer}
          hasRecentlyRequested={Boolean(
            requests
              .filter((r) => r.trainerId === trainer.id)
              .find(
                (r) =>
                  differenceInDays(new Date(), new Date(r.createdAt)) <
                  REQUEST_COOLDOWN_IN_DAYS,
              ),
          )}
        />
      ))}
    </ul>
  );
}

async function TrainerCard({
  trainer,
  hasRecentlyRequested,
}: {
  trainer: {
    id: string;
    address: string | null;
    email: string;
    phone: string | null;
    name: string | null;
    image: string | null;
    lastLogin: Date | null;
  };
  hasRecentlyRequested?: boolean;
}) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return (
    <li
      key={trainer.email}
      className="overflow-hidden rounded-lg bg-white shadow"
    >
      <div className="flex min-h-[140px] w-full items-start gap-6 p-6">
        <Link href={`/profile/${trainer.id}`}>
          <Avatar className="mx-auto shrink-0" size="lg">
            <AvatarImage src={trainer.image || "/img/avatar.jpg"} />
            <AvatarFallback>
              {getInitials({
                name: trainer.name,
                email: trainer.email,
              })}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 space-y-1 text-sm">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${trainer.id}`}>
              <h3 className="min-w-0 truncate font-medium text-gray-900">
                {trainer.name}
              </h3>
            </Link>
          </div>
          <p className="text-gray-500">
            <a
              href={`mailto:${trainer.email}`}
              className="flex items-center underline"
            >
              <span className="truncate">{trainer.email}</span>
              <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0" />
            </a>
          </p>
          {trainer.phone ? (
            <p className="truncate text-gray-500">
              <a
                href={`tel:${trainer.phone}`}
                className="flex min-w-0 items-center underline"
              >
                {trainer.phone}
                <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0" />
              </a>
            </p>
          ) : null}
          {trainer.address ? (
            <p className="truncate text-gray-500">{trainer.address}</p>
          ) : null}
        </div>
      </div>
      {session.user.role !== "trainer" ? (
        <footer className="flex items-center justify-end gap-4 px-4 py-2">
          <RequestTraining
            trainerId={trainer.id}
            disabled={hasRecentlyRequested}
          />
        </footer>
      ) : null}
    </li>
  );
}

async function SentTrainingRequests({
  requests,
}: {
  requests?: Awaited<ReturnType<typeof getTrainingRequests>>;
}) {
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
            <TableHead></TableHead>
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
              <TableCell>
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
