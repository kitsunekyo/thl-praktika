"use client";
import { Registration, Training, User } from "@prisma/client";
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { range } from "@/lib/utils";

export function CollapsibleRegistrations({
  training,
}: {
  training: Training & {
    registrations: (Registration & {
      user: Pick<
        User,
        | "id"
        | "image"
        | "name"
        | "phone"
        | "email"
        | "address"
        | "city"
        | "zipCode"
      >;
    })[];
  };
}) {
  const [open, setOpen] = useState(false);

  if (!training.registrations.length) {
    return (
      <div className="flex h-9 items-center px-3">
        <Registrations
          count={training.registrations.length}
          max={training.maxInterns}
        />
      </div>
    );
  }

  return (
    <Collapsible className="space-y-2" open={open} onOpenChange={setOpen}>
      <div className="flex h-9 w-full items-center px-3">
        <Registrations
          count={training.registrations.length}
          max={training.maxInterns}
        />
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-auto w-9 p-0">
            {open ? (
              <ChevronsDownUpIcon className="h-4 w-4" />
            ) : (
              <ChevronsUpDownIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {training.registrations.map(({ user, id }) => (
          <Link key={id} href={`/profile/${user.id}`}>
            <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs">
              <Avatar size="xs">
                <AvatarImage src={user.image || "/img/avatar.jpg"} />
              </Avatar>
              <span className="underline hover:no-underline">{user.name}</span>
            </div>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
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
