"use server";

import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function getUsers() {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/user");
}

export async function createUser(
  email: string,
  password: string,
  role = "user",
) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }
  if (currentUser.role !== "admin") {
    throw new Error("must be admin");
  }

  console.log("creating user", { email, password, role });
  const hashedPassword = await hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  redirect("/user");
}
