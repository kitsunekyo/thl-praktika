import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

export default async function AuthError({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <div
      className="md:flex"
      style={{ "--login-height": "calc(100vh - 88px - 160px)" }}
    >
      <div className="my-auto flex flex-col justify-center px-8 pt-8 md:w-1/2 md:justify-start md:px-24 md:pt-0 lg:px-32">
        {typeof searchParams.error === "string" && (
          <Message error={searchParams.error} />
        )}
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link href="/signup" className="font-semibold underline">
            <Button>Registrieren</Button>
          </Link>
          <Link href="/login" className="font-semibold underline">
            <Button variant="secondary">Anmelden</Button>
          </Link>
        </div>
      </div>
      <div className="relative hidden h-[var(--login-height)] w-1/2 overflow-hidden rounded-xl shadow-2xl md:block">
        <Image
          fill
          className="hidden object-cover md:block"
          src="/img/sam.jpg"
          alt=""
        />
      </div>
    </div>
  );
}

function Message({ error }: { error: string }) {
  if (error === "AccessDenied") {
    return (
      <>
        <h1 className="mb-6 text-4xl font-bold">Unbekannte Email Addresse</h1>
        <p>
          Die Email mit der du dich registrieren wolltest wurde nicht von uns
          eingeladen. Kontaktiere hi@mostviertel.tech um eine Einladung zu
          erhalten.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-6 text-4xl font-bold">
        Oops, ein Fehler ist aufgetreten
      </h1>
      <p>
        Es ist ein unbekannter Fehler beim Anmelden aufgetreten. Versuche es
        später erneut, oder kontaktiere hi@mostviertel.tech, sollte das Problem
        weiterhin bestehen.
      </p>
    </>
  );
}
