"use server";

import { User } from "@prisma/client";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AuthenticationError } from "@/lib/errors";
import { sendInvitationMail } from "@/lib/postmark";
import { prisma } from "@/lib/prisma";
import { preferencesSchema } from "@/modules/users/preferences";

import { getServerSession } from "../auth/next-auth";

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
export async function inviteUser(
  email: string,
  name = "",
  role: "user" | "trainer" | "admin" = "user",
  sendEmail: boolean = false,
) {
  const invitation = await prisma.invitation.findFirst({
    where: {
      email,
    },
  });

  if (invitation) {
    return {
      error: "invitation already exists",
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    return {
      error: "user already exists",
    };
  }

  const inv = await prisma.invitation.create({
    data: {
      email,
      name,
      role,
    },
  });

  if (!inv) {
    return {
      error: "could not create invitation",
    };
  }
  revalidatePath("/admin/invitations");
  if (!sendEmail) {
    return;
  }
  sendInvitationMail({ to: email, name, role, id: inv.id });
}

export async function resendInvitation(id: string) {
  const invitation = await prisma.invitation.findFirst({
    where: {
      id,
    },
  });

  if (!invitation) {
    return {
      error: "invitation does not exist",
    };
  }

  await prisma.invitation.update({
    where: {
      id,
    },
    data: {
      createdAt: new Date(),
    },
  });

  sendInvitationMail({
    to: invitation.email,
    name: invitation.name || "",
    role: invitation.role as "user" | "trainer",
    id: invitation.id,
  });
  revalidatePath("/admin/invitations");
}

export async function deleteInvitation(id: string) {
  await prisma.invitation.delete({ where: { id } });
  revalidatePath("/admin/invitations");
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
