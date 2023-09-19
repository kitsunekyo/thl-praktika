import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import { getServerSession } from "@/lib/next-auth";

import { LoginForm } from "./LoginForm";

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    return redirect("/");
  }

  return (
    <div
      className="md:flex"
      style={{ "--login-height": "calc(100vh - 88px - 160px)" }}
    >
      <div className="my-auto flex flex-col justify-center px-8 pt-8 md:w-1/2 md:justify-start md:px-24 md:pt-0 lg:px-32">
        <h1 className="mb-6 text-center text-4xl font-bold">Anmelden</h1>
        <LoginForm />
        <div className="pb-12 pt-12 text-center">
          <p>Du hast noch keinen Account?</p>
          <p>
            <Link href="#" className="font-semibold underline">
              Einladung anfragen
            </Link>
          </p>
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
