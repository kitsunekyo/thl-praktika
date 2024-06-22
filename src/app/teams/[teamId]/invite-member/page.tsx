import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { InviteMemberForm } from "@/modules/teams/components/InviteMemberForm";
import { getTeam } from "@/modules/teams/queries";

export default async function Page({
  params: { teamId },
}: {
  params: { teamId: string };
}) {
  const team = await getTeam(teamId);

  if (!team) {
    return notFound();
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/teams">Teams</BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem href={`/teams/${teamId}`}>{team.name}</BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem>Mitglied Einladen</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle>Lade Mitglieder ein</PageTitle>
        <InviteMemberForm teamId={teamId} />
      </div>
    </>
  );
}
