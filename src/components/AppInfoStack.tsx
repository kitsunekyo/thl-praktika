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
    <div className="fixed bottom-0 left-0">
      <ul className="max-w-xl space-y-1 p-2">
        {infos.map((info) => (
          <li key={info.storageKey}>
            <InfoBox {...info} />
          </li>
        ))}
      </ul>
    </div>
  );
}
