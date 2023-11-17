"use client";
import * as Sentry from "@sentry/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
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
          404 - Fährte verloren
        </h1>

        <p className="mb-6 text-muted-foreground">
          Ich konnte trotz meiner Spürnase leider nicht finden was du suchst.
        </p>

        <Link href="/">
          <Button>Zurück zur Startseite</Button>
        </Link>
      </div>
    </div>
  );
}
