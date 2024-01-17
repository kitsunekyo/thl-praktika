"use server";

import { User } from "@prisma/client";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getServerSession } from "@/lib/getServerSession";
import { preferencesSchema } from "@/lib/preferences";
import { prisma } from "@/lib/prisma";

export async function getProfile() {
  const session = await getServerSession();

  if (!session?.user) {
    return;
  }

  return prisma.user.findFirst({
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
      preferences: true,
    },
  });
}

export async function updateProfilePicture(imageUrl: string) {
  const session = await getServerSession();

  if (!session?.user) {
    return { error: "not authorized" };
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      image: imageUrl,
    },
  });

  revalidatePath("/profile");
}

export async function updateProfile(
  user: Partial<
    Omit<User, "password" | "emailVerified" | "email" | "id" | "preferences">
  >,
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

export async function updatePreferences(preferences: User["preferences"]) {
  const session = await getServerSession();

  if (!session?.user) {
    return { error: "not authorized" };
  }

  const validatedPreferences = preferencesSchema.parse(preferences);

  if (!validatedPreferences) {
    return { error: "invalid preferences" };
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      preferences: validatedPreferences,
    },
  });

  revalidatePath("/profile");
}

export async function changePassword(password: string) {
  const session = await getServerSession();
  if (!session) {
    return { error: "not authenticated" };
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      password: await hash(password, 12),
    },
  });
}

export async function deleteAccount() {
  const session = await getServerSession();
  if (!session) {
    return { error: "not authenticated" };
  }

  await prisma.user.delete({
    where: {
      id: session.user.id,
    },
  });

  redirect("/login");
}
