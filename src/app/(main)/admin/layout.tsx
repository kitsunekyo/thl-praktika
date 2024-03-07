import { notFound } from "next/navigation";

import { auth } from "@/modules/auth/next-auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return notFound();
  }

  return <>{children}</>;
}
