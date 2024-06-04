import Link from "next/link";
import { ReactNode } from "react";

import { InfoBox, InfoBoxVariantOptions } from "./InfoBox";

const infos: Array<{
  storageKey: string;
  variant: InfoBoxVariantOptions["variant"];
  content: ReactNode;
}> = [
  {
    storageKey: "pwa_info_20240528",
    variant: "info",
    content: (
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
          <InfoBox storageKey={info.storageKey} variant={info.variant}>
            {info.content}
          </InfoBox>
        </li>
      ))}
    </ul>
  );
}
