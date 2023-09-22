"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function register({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const unregisteredUser = await prisma.user.findFirst({
    where: {
      email,
      password: undefined,
    },
  });

  if (!unregisteredUser) {
    throw new Error("User already registered");
  }

  await prisma.user.update({
    where: {
      id: unregisteredUser.id,
    },
    data: {
      password,
    },
  });
  redirect("/login");
}
