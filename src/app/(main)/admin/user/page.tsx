import { MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { PageTitle } from "@/components/PageTitle";
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
import { authOptions } from "@/lib/next-auth";

import { getInvitations, getUsers } from "./actions";
import { InvitationActions } from "./InvitationActions";
import { UserActions } from "./UserActions";

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }
  return (
    <>
      <div className="flex items-baseline">
        <PageTitle>User und Einladungen</PageTitle>
        <div className="ml-auto">
          <Link href="/admin/user/create">
            <Button>User einladen oder erstellen</Button>
          </Link>
        </div>
      </div>
      <div className="space-y-12">
        <section>
          <div className="mb-6 flex items-center">
            <MailIcon className="mr-2 h-4 w-5" />
            <h2 className="font-bold">Einladungen</h2>
          </div>
          <InvitationList />
        </section>
        <section>
          <div className="mb-6 flex items-center">
            <UserIcon className="mr-2 h-4 w-5" />
            <h2 className="font-bold">User</h2>
          </div>
          <UserList />
        </section>
      </div>
    </>
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
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline">{user.role}</Badge>
            </TableCell>
            <TableCell>{user.name || "-"}</TableCell>
            <TableCell className="text-right">
              <UserActions user={user} />
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
          <TableHead></TableHead>
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
              <InvitationActions invitation={invitation} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
