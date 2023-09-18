import Link from "next/link";

import { Button } from "@/components/ui/button";

import { getUsers } from "./actions";
import { UserItem } from "./UserItem";

export default async function UserPage() {
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
    <ul className="space-y-4">
      {users.map((user) => (
        <li key={user.id}>
          <UserItem user={user} />
        </li>
      ))}
    </ul>
  );
}
