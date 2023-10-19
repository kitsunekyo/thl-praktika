"use server";

import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function getUsers() {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function createUser(
  email: string,
  password: string,
  name?: string,
  role = "user",
) {
  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  if (!user) {
    return {
      error: "user already exists",
    };
  }
}
