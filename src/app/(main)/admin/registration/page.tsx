import { redirect } from "next/navigation";

import { PageTitle } from "@/components/PageTitle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTrainingDate } from "@/lib/date";
import { getServerSession } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";

import { ActionButtons } from "./ActionButtons";

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
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }
  return (
    <>
      <PageTitle>Anmeldungen für Praktika</PageTitle>
      <Registrations />
    </>
  );
}

async function Registrations() {
  const registrations = await getRegistrations();

  if (registrations.length === 0) {
    return <p className="text-gray-400">Es gibt noch keine Anmeldungen.</p>;
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
            <TableCell>{registration.user.email}</TableCell>
            <TableCell>
              {formatTrainingDate(
                registration.training.date,
                registration.training.startTime,
                registration.training.endTime,
              )}
            </TableCell>
            <TableCell>{registration.training.author.email}</TableCell>
            <TableCell className="text-right">
              <ActionButtons id={registration.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
