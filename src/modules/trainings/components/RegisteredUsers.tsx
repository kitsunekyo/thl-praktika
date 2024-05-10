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
      <div className="flex items-center gap-2">
        <ul className="flex -space-x-2">
          {training.registrations.map(({ user, id }) => (
            <li key={id}>
              <Link href={`/profile/${user.id}`} title={user.name || user.id}>
                <Avatar className="border-4 border-white">
                  <AvatarImage src={user.image || "/img/avatar.jpg"} />
                </Avatar>
              </Link>
            </li>
          ))}
        </ul>
        <RegistrationCount
          count={training.registrations.length}
          max={training.maxInterns}
        />
      </div>
    </div>
  );
}
function RegistrationCount({ count, max }: { count: number; max: number }) {
  const freeSpots = max - count;

  if (freeSpots <= 0) {
    return <span className="text-xs font-semibold">voll</span>;
  }

  return (
    <span className="text-xs font-semibold">
      {count}/{max}
    </span>
  );
}
