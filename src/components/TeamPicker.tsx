"use client";

import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function TeamPicker({
  teams,
}: {
  teams: { id: string; name: string }[];
}) {
  const params = useParams<{ teamId: string }>();
  const [selectedId, setSelectedId] = useState(teams[0].id); // todo: remove and replace with optimistic

  let selectedTeam = teams.find((t) => t.id === params.teamId);
  if (!selectedTeam) {
    selectedTeam = teams[0];
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="min-w-0" asChild>
        <Button variant="outline" className="min-w-0 truncate" size="sm">
          <span className="min-w-0 truncate">{selectedTeam.name}</span>
          <ChevronUpDownIcon className="ml-1 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]">
        {teams.map((team) => (
          <DropdownMenuItem key={team.id} asChild>
            <Link href={`/team/${team.id}`}>{team.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
