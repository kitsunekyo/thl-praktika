import { Loader2Icon } from "lucide-react";

export function Loading() {
  return (
    <div className="grid min-h-[500px] place-items-center">
      <Loader2Icon className="h-10 w-10 animate-spin" />
    </div>
  );
}
