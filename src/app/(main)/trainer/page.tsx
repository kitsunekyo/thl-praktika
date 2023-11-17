import { Registration, Training, User } from "@prisma/client";
import { formatDistance } from "date-fns";

import { PageTitle } from "@/components/PageTitle";
import { TrainingActions } from "@/components/training/TrainingActions";
import { TrainingCard } from "@/components/training/TrainingCard";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getMyTrainings } from "./actions";
import { CreateTrainingButton } from "../CreateTrainingButton";
import { getProfile } from "../profile/actions";
import { getTrainingRequests } from "../trainers/requests/actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const profile = await getProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }
  const requests = await getTrainingRequests({ trainerId: profile.id });

  return (
    <div className="py-6">
      <PageTitle content="Hier findest du Praktika Anfragen die dir Student:innen geschickt haben. Wenn du ein neues Praktikum erstellst, werden alle in dieser Liste benachrichtigt.">
        Meine Anfragen
      </PageTitle>
      <Separator className="my-4" />
      <ReceivedTrainingRequests requests={requests} />
      <div className="my-16" />
      <PageTitle content="Hier findest du deine erstellten Praktika. Du kannst sehen wer angemeldet ist, kannst Praktika bearbeiten oder absagen.">
        Meine Praktika
      </PageTitle>
      <Separator className="my-4" />
      <CreateTrainingButton profile={profile} />
      <Trainings />
    </div>
  );
}

async function ReceivedTrainingRequests({
  requests,
}: {
  requests?: Awaited<ReturnType<typeof getTrainingRequests>>;
}) {
  if (!requests?.length) {
    return (
      <p className="text-sm text-gray-400">
        Du hast keine unbeantworteten Praktika Anfragen.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Praktikant:in</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead className="text-right">erhalten</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              <div className="max-w-[80px] truncate md:max-w-xs">
                {request.user.name}
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-[80px] truncate md:max-w-xs">
                {request.user.email}
              </div>
            </TableCell>
            <TableCell>{request.user.phone}</TableCell>
            <TableCell className="text-right">
              vor {formatDistance(request.createdAt, new Date())}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function Trainings() {
  const trainings = await getMyTrainings();

  return (
    <div className="py-6">
      {trainings.length > 0 ? (
        <TrainingList trainings={trainings} />
      ) : (
        <p className="text-sm text-gray-400">
          Du hast keine verfügbaren Praktika.
        </p>
      )}
    </div>
  );
}

function TrainingList({
  trainings,
}: {
  trainings: (Training & {
    author: Omit<User, "password">;
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
  })[];
}) {
  return (
    <ul className="max-w-2xl space-y-4">
      {trainings.map((t) => {
        const hasRegistrations = Boolean(t.registrations.length);
        return (
          <li key={t.id}>
            <TrainingCard
              training={t}
              actions={
                <TrainingActions
                  id={t.id}
                  training={t}
                  hasRegistrations={hasRegistrations}
                />
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
