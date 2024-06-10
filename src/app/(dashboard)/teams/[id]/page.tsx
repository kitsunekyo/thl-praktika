import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
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
        <BreadcrumbsItem>{team.name}</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle>{team.name}</PageTitle>
        <div className="space-y-2">
          <p>createdAt: {team.createdAt.toLocaleDateString()}</p>
          <p>licenseId: {team.licenseId}</p>
          <p>owner: {team.owner.name}</p>
          <section>
            <h3 className="font-medium">Members:</h3>
            <ul className="ml-8 list-disc">
              {team.users.map((user) => (
                <li key={user.id} className="flex items-center gap-2">
                  <div>{user.name}</div>
                  <Button variant="ghost" size="icon">
                    <span className="sr-only">delete</span>
                    <TrashIcon className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <Link href={`/teams/${id}/invite`}>
              <Button>Mitglieder einladen</Button>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
