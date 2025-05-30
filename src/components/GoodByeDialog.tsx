"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export const GoodByeDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-left">
            Praktika App wird eingestellt!
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="text-md mb-4">
            Unser Lehrgang hat mit Mai 2025 geendet. Daher wird die{" "}
            <strong>Praktika App mit Ende Juni 2025 eingestellt</strong>. Alle
            Daten werden Juli 2025 endgültig gelöscht.
          </p>
          <p className="text-md mb-4">
            Vielen Dank fürs Mitmachen und alles Gute!
          </p>
          <p className="text-lg">&mdash; Alex 👋</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
