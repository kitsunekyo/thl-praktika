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

import { getUsers } from "./actions";
import { UserActions } from "./UserActions";

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }
  return (
    <>
      <PageTitle>User</PageTitle>
      <div className="mb-8">
        <Link href="/admin/user/create">
          <Button variant="outline">User erstellen</Button>
        </Link>
      </div>
      <UserList />
    </>
  );
}

async function UserList() {
  const users = await getUsers();

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
