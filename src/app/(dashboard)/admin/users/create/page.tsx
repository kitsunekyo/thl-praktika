import { PageTitle } from "@/components/PageTitle";
import { Separator } from "@/components/ui/separator";
import { CreateUserForm } from "@/modules/users/components/CreateUserForm";

export default function CreateUserPage() {
  return (
    <div className="py-6">
      <PageTitle>Benutzer erstellen</PageTitle>
      <Separator className="my-4" />
      <CreateUserForm />
    </div>
  );
}
