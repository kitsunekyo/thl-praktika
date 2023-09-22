import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import { getServerSession } from "@/lib/next-auth";

import { LoginForm } from "./LoginForm";

export default async function Login({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  const email =
    typeof searchParams.email === "string" ? searchParams.email : undefined;

  return (
    <>
      <h1 className="mb-6 text-center text-4xl font-bold">Anmelden</h1>
      <LoginForm email={email} />
      <div className="mt-12 text-center">
        <p>Du hast noch keinen Account?</p>
        <p>
          <Link href="/signup" className="font-semibold underline">
            Registrieren
          </Link>
        </p>
      </div>
    </>
  );
}
