import Link from "next/link";

import { PageTitle } from "@/components/PageTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getInvitations } from "./actions";
import { InvitationButtons } from "./InvitationButtons";

export default async function UserPage() {
  return (
    <section className="py-6">
      <div className="flex items-center">
        <PageTitle>Einladungen</PageTitle>
        <Link href="/admin/invitations/create" className="ml-auto pl-4">
          <Button size="sm">Benutzer einladen</Button>
        </Link>
      </div>
      <Separator className="my-4" />
      <InvitationList />
    </section>
  );
}

async function InvitationList() {
  const invitations = await getInvitations();

  if (invitations.length === 0) {
    return (
      <p className="text-sm text-gray-400">Keine ausstehenden Einladungen.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[100px]">Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Rolle</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell className="font-medium">{invitation.email}</TableCell>
            <TableCell>{invitation.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{invitation.role}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <InvitationButtons invitation={invitation} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
