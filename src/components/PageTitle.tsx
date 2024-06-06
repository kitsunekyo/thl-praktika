import { ReactNode } from "react";

export function PageTitle({
  children,
  content,
}: {
  children: ReactNode;
  content?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="space-y-2 text-sm text-muted-foreground">
        <h1 className="text-xl font-semibold tracking-tight text-black">
          {children}
        </h1>
        {content}
      </div>
    </div>
  );
}
