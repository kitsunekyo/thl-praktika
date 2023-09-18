import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getUsers } from "./actions";
import { UserActions } from "./UserActions";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Users</h1>
      <div className="mb-8">
        <Link href="/user/create">
          <Button variant="outline">User erstellen</Button>
        </Link>
      </div>
      <UserList />
    </div>
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
            <TableCell className="text-right">
              <UserActions user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
