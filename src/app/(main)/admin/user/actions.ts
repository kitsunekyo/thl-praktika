"use server";

import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";

import { sendInvitationMail } from "@/lib/postmark";
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

export async function inviteUser(email: string, name = "", role = "user") {
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

  sendInvitationMail({ to: email, name });
}

export async function getInvitations() {
  return await prisma.invitation.findMany();
}

export async function deleteInvitation(id: string) {
  await prisma.invitation.delete({ where: { id } });
  revalidatePath("/user");
}
