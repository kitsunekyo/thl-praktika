import Link from "next/link";
import React, { Suspense } from "react";

import { cn } from "@/lib/utils";
import { getMyProfile } from "@/modules/users/queries";

import { UserMenu } from "./nav/UserMenu";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

async function UserMenuLoader() {
  const user = await getMyProfile();

  if (!user) {
    return (
      <Link href="/login">
        <Button size="sm" variant="link">
          Anmelden
        </Button>
      </Link>
    );
  }

  return <UserMenu user={user} />;
}

export function HeaderNavigation() {
  return (
    <>
      <div className="ml-auto hidden items-center gap-8 leading-[0] lg:flex">
        <ul className="flex items-center gap-4 text-sm">
          <li>
            <Link href="/help" className="hover:underline">
              Hilfe
            </Link>
          </li>
          <li>
            <Link href="/changelog" className="hover:underline">
              Änderungen
            </Link>
          </li>
        </ul>
        <Suspense fallback={<Skeleton className="h-8 w-[150px] rounded" />}>
          <UserMenuLoader />
        </Suspense>
      </div>
    </>
  );
}

export function Body({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid min-h-[calc(100vh-var(--header-size))] bg-gray-50",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Main({ children }: { children?: React.ReactNode }) {
  return (
    <main className="mx-auto h-full min-h-0 w-full grow px-4 md:pb-24 lg:px-8">
      {children}
    </main>
  );
}
