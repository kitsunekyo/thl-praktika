import { GlobalSidebarLayout } from "@/components/GlobalSidebarLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GlobalSidebarLayout>{children}</GlobalSidebarLayout>;
}
