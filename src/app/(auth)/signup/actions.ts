"use server";

import { hash } from "bcrypt";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function register({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  const invitation = await prisma.invitation.findFirst({
    where: {
      email,
    },
  });

  if (!invitation) {
    return {
      error: "No invitation found",
    };
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: invitation.role,
    },
  });

  await prisma.invitation.delete({
    where: {
      id: invitation.id,
    },
  });

  redirect("/login");
}
