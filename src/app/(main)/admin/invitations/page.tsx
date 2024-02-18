import { formatDistance } from "date-fns";
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
import { InvitationButtons } from "@/modules/users/components/InvitationButtons";
import { getInvitations } from "@/modules/users/queries";

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
          <TableHead className="text-right">eingeladen</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell className="font-medium">
              <div className="max-w-[80px] truncate md:max-w-none">
                {invitation.email}
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-[60px] truncate md:max-w-none">
                {invitation.name}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{invitation.role}</Badge>
            </TableCell>
            <TableCell className="hidden text-right md:table-cell">
              <p>{`vor ${formatDistance(invitation.createdAt, new Date())}`}</p>
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
