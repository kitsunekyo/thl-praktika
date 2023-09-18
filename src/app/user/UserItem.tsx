"use client";

import { Button } from "@/components/ui/button";

import { deleteUser } from "./actions";

export function UserItem({
  user,
}: {
  user: {
    name: string | null;
    email: string | null;
    id: string;
    role: string;
  };
}) {
  return (
    <div>
      <dl>
        <dd>
          {user.email} ({user.role})
        </dd>
      </dl>
      <Button
        size="sm"
        variant="destructive"
        onClick={async () => {
          await deleteUser(user.id);
        }}
      >
        delete
      </Button>
    </div>
  );
}
