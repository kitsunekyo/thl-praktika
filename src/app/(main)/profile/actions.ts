"use server";

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
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
}

export async function updateProfile(user: Partial<{ name: string }>) {
  const session = await getServerSession();

  if (!session?.user) {
    return;
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: user.name,
    },
  });

  revalidatePath("/profile");
}
