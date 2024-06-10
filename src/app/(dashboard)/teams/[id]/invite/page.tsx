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
  params: { id },
}: {
  params: { id: string };
}) {
  const team = await getTeam(id);

  if (!team) {
    return notFound();
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/teams">Teams</BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem href={`/teams/${id}`}>{team.name}</BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem>Mitglied Einladen</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle>Lade Mitglieder ein</PageTitle>
        <InviteMemberForm teamId={id} />
      </div>
    </>
  );
}
