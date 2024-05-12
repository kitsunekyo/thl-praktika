"use client";

import { InfoIcon, XIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export function SeminarInfoBox() {
  return (
    <InfoBox storageKey="block_info">
      <p>
        <span className="font-medium">Nächster THL Block:</span> 30. Mai - 02.
        Juni
      </p>
    </InfoBox>
  );
}

export function InfoBox({
  children,
  storageKey,
}: {
  children: ReactNode;
  storageKey: string;
}) {
  const localStorageKey = `info-box-closed-${storageKey}`;
  const [isClosed, setIsClosed] = useState(true);

  useEffect(() => {
    const isClosedFromLocalStorage = localStorage.getItem(localStorageKey);
    if (isClosedFromLocalStorage) {
      setIsClosed(JSON.parse(isClosedFromLocalStorage));
    } else {
      setIsClosed(false);
    }
  }, [localStorageKey]);

  const handleClose = () => {
    setIsClosed(true);
    localStorage.setItem(localStorageKey, JSON.stringify(true));
  };

  if (isClosed) {
    return null;
  }

  return (
    <div className="relative flex items-center gap-2 rounded border border-yellow-300 bg-yellow-100 px-4 py-2 text-sm text-yellow-600">
      <InfoIcon className="h-4 w-4" aria-hidden="true" />
      <div>{children}</div>
      <button onClick={handleClose} className="ml-auto p-2 text-inherit">
        <span className="sr-only">Info Box schließen</span>
        <XIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
