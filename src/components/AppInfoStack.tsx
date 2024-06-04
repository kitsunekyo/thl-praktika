import Link from "next/link";
import { ComponentProps } from "react";

import { InfoBox } from "./InfoBox";

const infos: ComponentProps<typeof InfoBox>[] = [
  {
    storageKey: "pwa_install_info",
    variant: "info",
    children: (
      <>
        <h3 className="font-medium">Wusstest du schon?</h3>
        <p className="mt-2 ">
          Du kannst die Seite als App auf deinem Smartphone installieren.{" "}
          <Link href="/help/install" className="underline">
            Mehr erfahren
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

  return (
    <ul className="space-y-1 pt-1">
      {infos.map((info) => (
        <li key={info.storageKey} className="px-1">
          <InfoBox {...info} />
        </li>
      ))}
    </ul>
  );
}
