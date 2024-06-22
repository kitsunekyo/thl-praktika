import { ReactNode } from "react";

import { Logo } from "./Logo";

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[var(--header-size)] items-center gap-2 border-b bg-white px-4 py-2">
      <Logo />
      {children}
    </header>
  );
}
