import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";

import { randomBetween } from "@/lib/utils";

import { InfoBox } from "./InfoBox";

const infos: ComponentProps<typeof InfoBox>[] = [
  {
    storageKey: "pwa_install_info",
    variant: "info",
    children: (
      <>
        <h3 className="font-medium">Wusstest du schon?</h3>
        <p className="mt-2 ">
          Du kannst die Seite wie eine App auf deinem Smartphone installieren.{" "}
        </p>
        <p className="mt-2">
          <Link
            href="/help/install"
            className="inline-flex items-center underline"
          >
            <span>Mehr erfahren</span>
            <ChevronRightIcon className="ml-1 inline-block h-4 w-4" />
          </Link>
        </p>
      </>
    ),
  },
  {
    storageKey: "address_distance_feature",
    variant: "info",
    children: (
      <>
        <h3 className="font-medium">Wusstest du schon?</h3>
        <p className="mt-2 ">
          Wenn du deine Adresse einträgst, kann die Fahrtzeit zum Trainingsort
          berechnet werden.
        </p>
        <p className="mt-2">
          <Link href="/profile" className="inline-flex items-center underline">
            <span>Zum Profil</span>
            <ChevronRightIcon className="ml-1 inline-block h-4 w-4" />
          </Link>
        </p>
      </>
    ),
  },
  {
    storageKey: "address_distance_feature",
    variant: "info",
    children: (
      <>
        <h3 className="font-medium">Wusstest du schon?</h3>
        <p className="mt-2 ">
          Auf der Seite Trainer:innen und auf Profilen von Trainer:innen können
          Praktikanten Praktika Anfragen senden.
        </p>
        <p className="mt-2">
          <Link href="/trainers" className="inline-flex items-center underline">
            <span>Zur Trainer:innen Übersicht</span>
            <ChevronRightIcon className="ml-1 inline-block h-4 w-4" />
          </Link>
        </p>
      </>
    ),
  },
  {
    storageKey: "email_notification_preferences",
    variant: "info",
    children: (
      <>
        <h3 className="font-medium">Wusstest du schon?</h3>
        <p className="mt-2 ">
          Wenn du weniger E-Mails erhalten möchtest, kannst du das in deinem
          Profil konfigurieren.
        </p>
        <p className="mt-2">
          <Link href="/profile" className="inline-flex items-center underline">
            <span>Zum Profil</span>
            <ChevronRightIcon className="ml-1 inline-block h-4 w-4" />
          </Link>
        </p>
      </>
    ),
  },
];

export function AppInfoStack() {
  if (infos.length === 0) {
    return null;
  }

  const randomInfo = infos[randomBetween(0, infos.length - 1)];

  return (
    <div className="fixed bottom-0 left-0">
      <div className="max-w-xl p-4">
        <InfoBox {...randomInfo} />
      </div>
    </div>
  );
}
