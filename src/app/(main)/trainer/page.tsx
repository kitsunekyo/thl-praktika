import { formatDistance } from "date-fns";

import { PageTitle } from "@/components/PageTitle";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CreateTrainingButton } from "../CreateTrainingButton";
import { getProfile } from "../profile/actions";
import { getTrainingRequests } from "../trainers/requests/actions";

export default async function Page() {
  const profile = await getProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }
  const requests = await getTrainingRequests({ trainerId: profile.id });

  return (
    <div className="py-6">
      <PageTitle content="Hier findest du Praktika Anfragen, die dir von Stundenten gesendet wurden.">
        Praktika Anfragen
      </PageTitle>
      <Separator className="my-4" />
      <CreateTrainingButton profile={profile} />
      <div className="my-4" />
      <ReceivedTrainingRequests requests={requests} />
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
