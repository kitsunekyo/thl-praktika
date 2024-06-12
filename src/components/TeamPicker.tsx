"use client";

import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
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
  const [selectedId, setSelectedId] = useState(teams[0].id);

  let selectedTeam = teams.find((t) => t.id === selectedId);
  if (!selectedTeam) {
    selectedTeam = teams[0];
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="min-w-0" asChild>
        <Button variant="ghost" className="min-w-0 truncate">
          <span className="min-w-0 truncate">{selectedTeam.name}</span>
          <ChevronUpDownIcon className="ml-1 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]">
        {teams.map((team) => (
          <DropdownMenuItem
            key={team.id}
            onClick={() => {
              setSelectedId(team.id);
            }}
          >
            {team.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
