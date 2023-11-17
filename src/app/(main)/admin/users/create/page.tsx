import { PageTitle } from "@/components/PageTitle";
import { Separator } from "@/components/ui/separator";

import { CreateUserForm } from "./CreateUserForm";

export const dynamic = "force-dynamic";

export default function CreateUserPage() {
  return (
    <div className="py-6">
      <PageTitle>Benutzer erstellen</PageTitle>
      <Separator className="my-4" />
      <CreateUserForm />
    </div>
  );
}
