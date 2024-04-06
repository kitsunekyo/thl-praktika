import { Skeleton } from "./ui/skeleton";

export function Loading() {
  return (
    <div className="max-w-2xl space-y-6 py-6">
      <div className="space-y-3">
        <Skeleton className="h-[225px] rounded-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-[125px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-[125px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-[125px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      </div>
    </div>
  );
}
