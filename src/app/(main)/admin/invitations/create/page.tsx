import { InviteUserForm } from "@/components/InviteUserForm";
import { PageTitle } from "@/components/PageTitle";
import { Separator } from "@/components/ui/separator";

export default function CreateUserPage() {
  return (
    <div className="py-6">
      <PageTitle>Benutzer einladen</PageTitle>
      <Separator className="my-4" />
      <InviteUserForm />
    </div>
  );
}
