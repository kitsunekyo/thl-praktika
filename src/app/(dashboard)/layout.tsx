import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
