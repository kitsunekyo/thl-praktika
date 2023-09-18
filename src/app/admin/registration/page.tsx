import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatTrainingDate } from "@/lib/utils";

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
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }
  return (
    <div>
      <h1 className="mb-8 text-xl font-semibold">Anmeldungen für Praktika</h1>
      <Registrations />
    </div>
  );
}

async function Registrations() {
  const registrations = await getRegistrations();

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
