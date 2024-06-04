"use client";

import { EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequestTraining } from "@/modules/trainings/components/RequestTraining";

export function TrainerMenu({
  trainerId,
  isRequestCooldown,
  userRole,
}: {
  trainerId: string;
  isRequestCooldown: boolean;
  userRole: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded focus:outline-none">
        <EllipsisVerticalIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]">
        <DropdownMenuItem key={`/profile/${trainerId}`} asChild>
          <Link
            href={`/profile/${trainerId}`}
            className="w-full cursor-pointer"
          >
            Zum Profil
          </Link>
        </DropdownMenuItem>
        {userRole === "user" && (
          <RequestTraining trainerId={trainerId} disabled={isRequestCooldown}>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="md:hidden"
            >
              Praktikum anfragen
            </DropdownMenuItem>
          </RequestTraining>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
