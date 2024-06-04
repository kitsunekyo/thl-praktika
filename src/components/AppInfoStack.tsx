import { ChevronRightIcon } from "lucide-react";
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
