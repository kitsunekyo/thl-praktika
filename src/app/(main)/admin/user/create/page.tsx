import { PageTitle } from "@/components/PageTitle";

import { UserForm } from "./user-form";

export default function CreateUserPage() {
  return (
    <>
      <PageTitle>Benutzer erstellen oder einladen</PageTitle>
      <UserForm />
    </>
  );
}
