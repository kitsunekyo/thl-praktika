import { formatDistance } from "date-fns";

import { PageTitle } from "@/components/PageTitle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTrainingRequests } from "@/modules/trainers/queries";
import { CreateTraining } from "@/modules/trainings/components/CreateTraining";
import { getProfile } from "@/modules/users/queries";

export default async function Page() {
  const profile = await getProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }
  const requests = await getTrainingRequests({ trainerId: profile.id });

  return (
    <div className="mx-auto max-w-2xl py-6">
      <PageTitle content="Hier findest du Praktika Anfragen die dir Student:innen geschickt haben. Wenn du ein neues Praktikum erstellst, werden alle in dieser Liste benachrichtigt.">
        Praktika Anfragen
      </PageTitle>
      <div className="my-4 flex items-center justify-end">
        <CreateTraining profile={profile} />
      </div>
      <div className="overflow-x-hidden">
        <ReceivedTrainingRequests requests={requests} />
      </div>
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
      <p className="text-sm text-muted-foreground">
        Du hast keine unbeantworteten Praktika Anfragen.
      </p>
    );
  }

  return (
    <Table className="overflow-hidden rounded-lg bg-white shadow-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Praktikant:in</TableHead>
          <TableHead></TableHead>
          <TableHead className="text-right">erhalten</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              <div>
                <div className="max-w-[80px] truncate md:max-w-xs">
                  {request.user.name}
                </div>
                <div className="max-w-[80px] truncate md:max-w-xs">
                  <a href={`mailto:${request.user.email}`}>
                    {request.user.email}
                  </a>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-[80px] truncate md:max-w-xs">
                <a href={`tel:${request.user.phone}`}>{request.user.phone}</a>
              </div>
            </TableCell>
            <TableCell className="text-right">
              vor {formatDistance(request.createdAt, new Date())}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}