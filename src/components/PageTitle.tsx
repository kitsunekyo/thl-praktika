import { ReactNode } from "react";

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-6 text-2xl font-semibold md:mb-12">{children}</h1>;
}
