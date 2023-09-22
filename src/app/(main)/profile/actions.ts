"use server";

import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";

export async function getMe() {
  const session = await getServerSession();

  if (!session?.user) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      image: true,
      role: true,
      address: true,
      city: true,
      zipCode: true,
      phone: true,
    },
  });
}

export async function updateProfile(
  user: Partial<Omit<User, "password" | "emailVerified" | "email" | "id">>,
) {
  const session = await getServerSession();

  if (!session?.user) {
    return { error: "not authorized" };
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: user,
  });

  revalidatePath("/profile");
}
