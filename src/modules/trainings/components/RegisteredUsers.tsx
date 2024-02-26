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
    <div className="space-y-2">
      <div className="flex h-9 w-full items-center">
        <Registrations
          count={training.registrations.length}
          max={training.maxInterns}
        />
      </div>
      {!training.registrations.length ? null : (
        <ul className="flex flex-wrap items-center gap-2">
          {training.registrations.map(({ user, id }) => (
            <Link key={id} href={`/profile/${user.id}`} className="block">
              <li className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 text-xs">
                <Avatar size="xs">
                  <AvatarImage src={user.image || "/img/avatar.jpg"} />
                </Avatar>
                <span>{user.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
export function Registrations({ count, max }: { count: number; max: number }) {
  const freeSpots = max - count;

  return (
    <div className="flex items-center">
      {range(count).map((i) => (
        <UserCheckIcon key={i} className="h-5 w-5" />
      ))}
      {range(freeSpots).map((i) => (
        <UserIcon key={i} className="h-5 w-5 text-gray-400" />
      ))}
      {freeSpots > 0 ? (
        <span className="ml-2 text-xs">
          {count}/{max} Anmeldungen
        </span>
      ) : (
        <span className="ml-2 text-xs">voll</span>
      )}
    </div>
  );
}
