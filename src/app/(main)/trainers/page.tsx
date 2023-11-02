import { differenceInDays, formatDistance } from "date-fns";
import Link from "next/link";

import { PageTitle } from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerSession } from "@/lib/next-auth";
import { formatAddress } from "@/lib/user";
import { getInitials } from "@/lib/utils";

import { getTrainers } from "./actions";
import { getTrainingRequests } from "./requests/actions";
import { RequestTrainingButton } from "./RequestTrainingButton";

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

      <Separator className="my-4" />

      <TrainerList
        trainers={trainers}
        requests={myRequests}
        role={session.user.role}
      />

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

async function TrainerList({
  trainers,
  requests,
  role = "user",
}: {
  trainers: Awaited<ReturnType<typeof getTrainers>>;
  requests: Awaited<ReturnType<typeof getTrainingRequests>>;
  role?: string;
}) {
  if (trainers.length === 0) {
    return (
      <p className="text-sm text-gray-400">Keine Trainer:innen verfügbar.</p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trainers.map((trainer) => {
        const address = formatAddress({
          address: trainer.address,
          city: trainer.city,
          zipCode: trainer.zipCode,
        });
        const googleMapsUrl = `https://www.google.com/maps/place/${address.replaceAll(
          " ",
          "+",
        )}`;
        const requestCooldownInDays = 7;
        const hasRecentlyRequested = Boolean(
          requests
            .filter((r) => r.trainerId === trainer.id)
            .find(
              (r) =>
                differenceInDays(new Date(), new Date(r.createdAt)) <
                requestCooldownInDays,
            ),
        );

        return (
          <Card key={trainer.id} className="flex flex-col gap-4 p-4">
            <div className="flex grow gap-4">
              <Avatar className="shrink-0" size="lg">
                <AvatarImage src={trainer.image || "/img/avatar.jpg"} />
                <AvatarFallback>
                  {getInitials({
                    name: trainer.name,
                    email: trainer.email,
                  })}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col justify-between text-sm">
                <dl className="text-muted-foreground">
                  {trainer.name && (
                    <dd className="font-medium text-black">{trainer.name}</dd>
                  )}
                  <dd>{trainer.email}</dd>
                  {trainer.phone && <dd>{trainer.phone}</dd>}
                  {!!address && (
                    <Link
                      href={googleMapsUrl}
                      target="_blank"
                      className="underline hover:no-underline"
                    >
                      {address}
                    </Link>
                  )}
                </dl>
              </div>
            </div>
            {role === "user" && (
              <RequestTrainingButton
                trainerId={trainer.id}
                disabled={hasRecentlyRequested}
              />
            )}
          </Card>
        );
      })}
    </div>
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
          <TableHead className="w-[200px]">Trainer:in</TableHead>
          <TableHead className="w-[100px]"></TableHead>
          <TableHead className="text-right">gesendet</TableHead>
          {/* <TableHead className="w-[50px] text-right"></TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="truncate font-medium">
              {request.trainer.name}
            </TableCell>
            <TableCell>{request.trainer.email}</TableCell>
            <TableCell className="text-right">
              {formatDistance(request.createdAt, new Date())}
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
