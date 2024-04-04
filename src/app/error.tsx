"use client";
import * as Sentry from "@sentry/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  // instanceof AuthorizationError does not work here, probably because error is serialized for client
  if (error.message === "Unauthorized") {
    signOut();
    redirect("/login");
  }

  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <Image
          src="/img/dog-bucket.svg"
          className="mx-auto h-56"
          width={196}
          height={224}
          alt="Hund mit Eimer am Kopf"
        />

        <h1 className="mb-2 mt-6 text-2xl font-bold tracking-tight sm:text-4xl">
          Hoppala
        </h1>

        <p className="mb-6 text-muted-foreground">
          Da ist wohl was schief gegangen. Der Fehler wurde gemeldet und wird
          hoffentlich schnell behoben.
        </p>

        <Link href="/">
          <Button>Zur Startseite</Button>
        </Link>
      </div>
    </div>
  );
}
