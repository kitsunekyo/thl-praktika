import { differenceInDays, formatDistance } from "date-fns";
import { MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

import { PageTitle } from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerSession } from "@/modules/auth/getServerSession";
import { getTrainers, getTrainingRequests } from "@/modules/trainers/queries";
import { RequestTraining } from "@/modules/trainings/components/RequestTraining";
import { formatAddress } from "@/modules/users/address";
import { getInitials } from "@/modules/users/name";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const trainers = await getTrainers();
  const myRequests = await getTrainingRequests({ userId: session.user.id });

  return (
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
          <h2 className="mb-4 font-medium">Gesendete Anfragen</h2>
          <SentTrainingRequests requests={myRequests} />
        </>
      )}
    </div>
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}

function LastLogin({ date }: { date: Date | null }) {
  return (
    <span>
      {date
        ? `zuletzt online vor ${formatDistance(date, new Date())}`
        : "noch nicht online"}
    </span>
  );
}

async function TrainerCard({
  trainer,
  hasRecentlyRequested,
}: {
  trainer: {
    id: string;
    address: string | null;
    city: string | null;
    zipCode: string | null;
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
  const address = formatAddress({
    address: trainer.address,
    city: trainer.city,
    zipCode: trainer.zipCode,
  });
  const googleMapsUrl = `https://www.google.com/maps/place/${address.replaceAll(
    " ",
    "+",
  )}`;
  return (
    <li
      key={trainer.id}
      className="col-span-1 flex flex-col divide-y rounded-xl bg-white text-center shadow-lg"
    >
      <div className="flex flex-1 flex-col p-8">
        <Link href={`/profile/${trainer.id}`}>
          <Avatar className="mx-auto shrink-0" size="xl">
            <AvatarImage src={trainer.image || "/img/avatar.jpg"} />
            <AvatarFallback>
              {getInitials({
                name: trainer.name,
                email: trainer.email,
              })}
            </AvatarFallback>
          </Avatar>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {trainer.name}
          </h3>
        </Link>
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <dt className="sr-only">Zuletzt Online</dt>
          <dd className="my-2">
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              <LastLogin date={trainer.lastLogin} />
            </span>
          </dd>
          <dt className="sr-only">Adresse</dt>
          <dd className="text-sm text-gray-500">
            <a href={googleMapsUrl}>{formatAddress(trainer)}</a>
          </dd>
          <dt className="sr-only">Email</dt>
          <dd className="text-sm text-gray-500">{trainer.email}</dd>
          {trainer.phone ? (
            <>
              <dt className="sr-only">Telefon</dt>
              <dd className="text-sm text-gray-500">{trainer.phone}</dd>
            </>
          ) : null}
        </dl>
      </div>
      <div className="flex divide-x">
        <div className="flex gap-2 px-4">
          <a
            href={`mailto:${trainer.email}`}
            className="relative inline-flex items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm"
          >
            <MailIcon className="h-4 w-4" aria-hidden="true" />
          </a>
          {trainer.phone ? (
            <a
              href={`tel:${trainer.phone}`}
              className="relative inline-flex items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm"
            >
              <PhoneIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>

        {session.user.role !== "trainer" ? (
          <div className="flex grow px-4">
            <RequestTraining
              trainerId={trainer.id}
              disabled={hasRecentlyRequested}
            />
          </div>
        ) : null}
      </div>
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
  );
}
