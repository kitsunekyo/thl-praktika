"use server";

import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/next-auth";
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
  const session = await getServerSession();
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
      role,
    },
  });

  redirect("/admin/user");
}

export async function inviteUser(email: string, role = "user") {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }
  if (currentUser.role !== "admin") {
    throw new Error("not allowed");
  }

  await prisma.invitation.create({
    data: {
      email,
      role,
    },
  });

  redirect("/admin/user");
}

export async function getInvitations() {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }
  if (currentUser.role !== "admin") {
    throw new Error("not allowed");
  }

  return await prisma.invitation.findMany({
    select: { id: true, email: true, role: true },
  });
}
