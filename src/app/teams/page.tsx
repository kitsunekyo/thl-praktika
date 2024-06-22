import Link from "next/link";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { getMyTeams } from "@/modules/teams/queries";

export default async function Page() {
  const myTeams = await getMyTeams();

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem>Teams</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle>Meine Teams</PageTitle>
        <Link href="/teams/create">
          <Button>Team erstellen</Button>
        </Link>
        <ul className="list-disc space-y-2 px-8">
          {myTeams.map((team) => (
            <li key={team.id}>
              <Link
                href={`/teams/${team.id}`}
                className="font-medium hover:underline"
              >
                {team.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
