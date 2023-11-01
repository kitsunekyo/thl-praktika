import { differenceInDays, format, formatDuration } from "date-fns";
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
import { secondsToDuration } from "@/lib/date";
import { getServerSession } from "@/lib/next-auth";
import { formatAddress, getTraveltime } from "@/lib/user";
import { getInitials } from "@/lib/utils";

import { getTrainers } from "./actions";
import { DeleteButton } from "./DeleteTrainingRequestButton";
import { getTrainingRequests } from "./requests/actions";
import { RequestTrainingButton } from "./RequestTrainingButton";
import { getProfile } from "../profile/actions";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const trainers = await getTrainers();
  const myRequests = await getTrainingRequests({ userId: session.user.id });

  return (
    <div className="py-6">
      <PageTitle content="Sende Praktika Anfragen an Trainer:innen. Sie erhalten eine Benachrichtigung mit der Bitte Praktika einzutragen, für die du dich anmelden kannst.">
        Trainer:innen
      </PageTitle>
      <Separator className="my-4" />
      <TrainerList trainers={trainers} requests={myRequests} />
      <div className="my-8" />
      <h2 className="mb-4 font-medium">Gesendete Anfragen</h2>
      <MyTrainingRequests requests={myRequests} />
    </div>
  );
}

async function TrainerList({
  trainers,
  requests,
}: {
  trainers: Awaited<ReturnType<typeof getTrainers>>;
  requests: Awaited<ReturnType<typeof getTrainingRequests>>;
}) {
  const user = await getProfile();

  if (!user) {
    throw new Error("Couldn't load profile");
  }

  if (trainers.length === 0) {
    return (
      <p className="text-sm text-gray-400">Keine Trainer:innen verfügbar.</p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trainers.map(async (trainer) => {
        const address = formatAddress({
          address: trainer.address,
          city: trainer.city,
          zipCode: trainer.zipCode,
        });
        const googleMapsUrl = `https://www.google.com/maps/place/${address.replaceAll(
          " ",
          "+",
        )}`;
        const traveltime = await getTraveltime(user, trainer);
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
          <Card key={trainer.id} className="flex gap-4 p-4">
            <Avatar className="shrink-0">
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
                  <>
                    <Link
                      href={googleMapsUrl}
                      target="_blank"
                      className="underline hover:no-underline"
                    >
                      {address}
                    </Link>
                    {!!traveltime && (
                      <p className="text-xs">
                        {formatDuration(secondsToDuration(traveltime), {
                          format: ["hours", "minutes"],
                        })}{" "}
                        entfernt
                      </p>
                    )}
                  </>
                )}
              </dl>
              <div className="pt-2">
                <RequestTrainingButton
                  trainerId={trainer.id}
                  disabled={hasRecentlyRequested}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

async function MyTrainingRequests({
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Trainer:in</TableHead>
          <TableHead className="w-[100px]"></TableHead>
          <TableHead className="text-right">gesendet am</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="truncate font-medium">
              {request.user.name}
            </TableCell>
            <TableCell>{request.trainer.email}</TableCell>
            <TableCell className="text-right">
              {format(request.createdAt, "do MMM yy HH:mm")}
            </TableCell>
            <TableCell className="text-right">
              <DeleteButton requestId={request.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
