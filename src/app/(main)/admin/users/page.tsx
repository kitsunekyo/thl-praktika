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

import { getUsers } from "./actions";
import { UserButtons } from "./UserButtons";

export default async function UserPage() {
  return (
    <section className="py-6">
      <div className="flex items-center">
        <PageTitle>Benutzer</PageTitle>
        <Link href="/admin/users/create" className="ml-auto pl-4">
          <Button size="sm">Benutzer erstellen</Button>
        </Link>
      </div>
      <Separator className="my-4" />
      <UserList />
    </section>
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
            <TableCell className="font-medium">
              <div className="md:max-w-auto max-w-[80px] truncate">
                {user.email}
              </div>
            </TableCell>
            <TableCell>
              <div className="md:max-w-auto max-w-[60px] truncate">
                {user.name || "-"}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{user.role}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <UserButtons user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
