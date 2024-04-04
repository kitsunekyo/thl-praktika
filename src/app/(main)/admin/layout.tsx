import { notFound } from "next/navigation";

import { getServerSession } from "@/modules/auth/next-auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    return notFound();
  }

  return <>{children}</>;
}
