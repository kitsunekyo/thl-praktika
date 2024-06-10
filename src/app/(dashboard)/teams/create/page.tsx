import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { CreateTeamForm } from "@/modules/teams/components/CreateTeamForm";

export default async function Page() {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/teams">Teams</BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem>Erstellen</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle
          content={
            <p>
              Mit einem Team hast du einen ganz eigenen Bereich. Nur Mitglieder
              können Events sehen und sich dafür anmelden.
            </p>
          }
        >
          Erstelle ein Team
        </PageTitle>
        <CreateTeamForm />
      </div>
    </>
  );
}
