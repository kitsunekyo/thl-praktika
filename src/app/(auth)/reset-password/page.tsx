import Link from "next/link";

import { Button } from "@/components/ui/button";

import { getIsTokenValid } from "./actions";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { t: string | undefined; v: string | undefined };
}) {
  if (!searchParams.t || !searchParams.v) {
    return <TokenInvalid />;
  }
  const isTokenValid = await getIsTokenValid(searchParams.t);
  if (!isTokenValid) {
    return <TokenInvalid />;
  }

  return (
    <ResetPasswordForm tokenId={searchParams.t} tokenValue={searchParams.v} />
  );
}

function TokenInvalid() {
  return (
    <>
      <h1 className="mb-4 text-center text-4xl font-bold">Link ungültig</h1>
      <p className="mb-8 text-center text-red-500">
        Der Link zum Passwort zurücksetzen ist abgelaufen oder ungültig. Bitte
        fordere einen neuen an.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/forgot-password" className="font-semibold underline">
          <Button>Neuen Link anfordern</Button>
        </Link>
        <Link href="/login" className="font-semibold underline">
          <Button variant="secondary">Anmelden</Button>
        </Link>
      </div>
    </>
  );
}
