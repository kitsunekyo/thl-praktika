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
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{children}</h2>
        {content && <p className="text-sm text-muted-foreground">{content}</p>}
      </div>
    </div>
  );
}
