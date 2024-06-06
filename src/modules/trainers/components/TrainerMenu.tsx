"use client";

import { EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequestTrainingDialog } from "@/modules/trainings/components/RequestTrainingDialog";

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
        {userRole === "user" ? (
          !isRequestCooldown ? (
            <RequestTrainingDialog trainerId={trainerId}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="md:hidden"
              >
                Praktikum anfragen
              </DropdownMenuItem>
            </RequestTrainingDialog>
          ) : (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Anfrage gesendet
            </div>
          )
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
