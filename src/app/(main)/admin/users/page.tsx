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
import { DeleteUser } from "@/modules/users/components/DeleteUser";
import { getUsers } from "@/modules/users/queries";

export default async function UserPage() {
  return (
    <section className="py-6">
      <div className="flex items-center">
        <PageTitle>Benutzer</PageTitle>
        <Link href="/admin/users/create" className="ml-auto pl-4">
          <Button size="sm">Benutzer erstellen</Button>
        </Link>
      </div>
      <UserList />
    </section>
  );
}

async function UserList() {
  const users = await getUsers();

  if (users.length === 0) {
    return <p className="text-sm text-gray-400">Keine User.</p>;
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (a.lastLogin && b.lastLogin) {
      return b.lastLogin.getTime() - a.lastLogin.getTime();
    }

    if (a.lastLogin) {
      return -1;
    }

    if (b.lastLogin) {
      return 1;
    }

    return 0;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Email</TableHead>
          <TableHead>Rolle</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="hidden text-right md:table-cell">
            zuletzt online
          </TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              <div className="max-w-[80px] truncate md:max-w-none">
                {user.email}
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-[60px] truncate md:max-w-none">
                {user.name || "-"}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{user.role}</Badge>
            </TableCell>
            <TableCell className="hidden text-right md:table-cell">
              <p>
                {user.lastLogin
                  ? `vor ${formatDistance(user.lastLogin, new Date())}`
                  : "-"}
              </p>
            </TableCell>
            <TableCell className="text-right">
              <DeleteUser user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
