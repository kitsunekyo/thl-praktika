import { CreateUserForm } from "@/components/CreateUserForm";
import { PageTitle } from "@/components/PageTitle";
import { Separator } from "@/components/ui/separator";

export default function CreateUserPage() {
  return (
    <div className="py-6">
      <PageTitle>Benutzer erstellen</PageTitle>
      <Separator className="my-4" />
      <CreateUserForm />
    </div>
  );
}
