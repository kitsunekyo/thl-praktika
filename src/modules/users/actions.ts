"use server";

import { User } from "@prisma/client";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AuthenticationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { preferencesSchema } from "@/modules/users/preferences";

import { getServerSession } from "../auth/next-auth";

export async function updateProfilePicture(imageUrl: string) {
  const session = await getServerSession();
  if (!session?.user) {
    return { error: "not authenticated" };
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
    return { error: "not authenticated" };
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
    return { error: "not authenticated" };
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
    throw new AuthenticationError();
  }

  return prisma.user.update({
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
  if (!session?.user) {
    return { error: "not authenticated" };
  }

  await prisma.user.delete({
    where: {
      id: session.user.id,
    },
  });

  redirect("/login");
}
