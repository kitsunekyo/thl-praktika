import { MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getInvitations, getUsers } from "./actions";
import { InvitationButtons } from "./InvitationButtons";
import { UserButtons } from "./UserButtons";

export default async function UserPage() {
  return (
    <div className="space-y-12">
      <section>
        <div className="mb-6 flex items-center">
          <MailIcon className="mr-2 h-4 w-5" />
          <h2 className="font-bold">Einladungen</h2>
          <Link href="/admin/user/create" className="ml-auto pl-4">
            <Button size="sm">Benutzer einladen</Button>
          </Link>
        </div>
        <InvitationList />
      </section>
      <section>
        <div className="mb-6 flex items-center">
          <UserIcon className="mr-2 h-4 w-5" />
          <h2 className="font-bold">Benutzer</h2>
          <Link href="/admin/user/create" className="ml-auto pl-4">
            <Button size="sm">Benutzer erstellen</Button>
          </Link>
        </div>
        <UserList />
      </section>
    </div>
  );
}

async function UserList() {
  const users = await getUsers();

  if (users.length === 0) {
    return <p className="text-sm text-gray-400">Keine User.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Email</TableHead>
          <TableHead>Rolle</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="truncate font-medium">{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline">{user.role}</Badge>
            </TableCell>
            <TableCell>{user.name || "-"}</TableCell>
            <TableCell className="text-right">
              <UserButtons user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
