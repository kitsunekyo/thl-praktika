import { TeamLayout } from "@/components/TeamLayout";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { teamId: string };
}) {
  return <TeamLayout teamId={params.teamId}>{children}</TeamLayout>;
}
