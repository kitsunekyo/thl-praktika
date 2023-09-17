"use server";

import { hash } from "bcrypt";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function createUser(email: string, password: string) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }
  if (currentUser.role !== "admin") {
    throw new Error("must be admin");
  }
  const hashedPassword = await hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  redirect("/");
}
