"use client";

import { User } from "@prisma/client";
import { UserCheckIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { range } from "@/lib/utils";

export function RegisteredUsers({
  training,
}: {
  training: { maxInterns: number } & {
    registrations: {
      id: string;
      user: Pick<User, "id" | "image" | "name">;
    }[];
  };
}) {
  return (
    <div className="space-y-4">
      <RegistrationCount
        count={training.registrations.length}
        max={training.maxInterns}
      />
      {!training.registrations.length ? null : (
        <ul className="flex flex-wrap items-center gap-2 text-xs">
          {training.registrations.map(({ user, id }) => (
            <li key={id} className="inline-block rounded-lg bg-gray-100">
              <Link
                href={`/profile/${user.id}`}
                className="flex items-center gap-2 px-2 py-1"
              >
                <Avatar size="xs">
                  <AvatarImage src={user.image || "/img/avatar.jpg"} />
                </Avatar>
                <span>{user.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
function RegistrationCount({ count, max }: { count: number; max: number }) {
  const freeSpots = max - count;

  return (
    <div className="flex items-center">
      <ul className="flex items-center">
        {range(count).map((i) => (
          <li key={i}>
            <UserCheckIcon className="h-5 w-5" />
          </li>
        ))}
        {range(freeSpots).map((i) => (
          <li key={i}>
            <UserIcon className="h-5 w-5 text-gray-400" />
          </li>
        ))}
      </ul>
      {freeSpots > 0 ? (
        <span className="ml-2 text-xs font-medium">
          {count}/{max}
        </span>
      ) : (
        <span className="ml-2 text-xs">voll</span>
      )}
    </div>
  );
}
