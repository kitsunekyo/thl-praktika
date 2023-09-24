import { PageTitle } from "@/components/PageTitle";

import { UserForm } from "./UserForm";

export default function CreateUserPage() {
  return (
    <>
      <PageTitle>Benutzer erstellen oder einladen</PageTitle>
      <UserForm />
    </>
  );
}
