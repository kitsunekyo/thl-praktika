import { RegistrationButtons } from "@/components/admin/RegistrationButtons";
import { TrainingDate } from "@/components/training/TrainingDate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

async function getRegistrations() {
  return await prisma.registration.findMany({
    include: {
      training: {
        include: {
          author: true,
        },
      },
      user: true,
    },
  });
}

export default async function RegistrationsPage() {
  const registrations = await getRegistrations();

  if (registrations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Es gibt noch keine Anmeldungen.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">User</TableHead>
          <TableHead>Datum</TableHead>
          <TableHead>Trainer</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((registration) => (
          <TableRow key={registration.id}>
            <TableCell>
              {registration.user.name || registration.user.email}
            </TableCell>
            <TableCell className="truncate whitespace-nowrap">
              <TrainingDate
                start={registration.training.start}
                end={registration.training.end}
              />
            </TableCell>
            <TableCell className="truncate">
              {registration.training.author.name ||
                registration.training.author.email}
            </TableCell>
            <TableCell className="text-right">
              <RegistrationButtons id={registration.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
