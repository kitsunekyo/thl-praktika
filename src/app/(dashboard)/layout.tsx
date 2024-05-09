import { SidebarLayout } from "@/components/layouts";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
