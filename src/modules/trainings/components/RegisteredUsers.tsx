"use client";

import { User } from "@prisma/client";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

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
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        {!training.registrations.length ? (
          <p className="text-xs text-muted-foreground">
            Noch keine Anmeldungen
          </p>
        ) : (
          <ul className="flex -space-x-1">
            {training.registrations.map(({ user, id }) => (
              <li key={id} className="rounded-full ring-2 ring-white">
                <Link
                  href={`/profile/${user.id}`}
                  title={user.name || user.id}
                  className="block leading-[0]"
                >
                  <Avatar size="xs">
                    <AvatarImage src={user.image || "/img/avatar.jpg"} />
                  </Avatar>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <RegistrationCount
          count={training.registrations.length}
          max={training.maxInterns}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {training.registrations
          .map(({ user }) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="underline"
            >
              {user.name}
            </Link>
          ))
          .map((element, index, array) => (
            <>
              {element}
              {index < array.length - 2 ? ", " : ""}
              {index === array.length - 2 ? " und " : ""}
            </>
          ))}
      </p>
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
