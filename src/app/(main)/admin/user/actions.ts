"use server";

import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/next-auth";
import { sendEmail, sendInvitationMail } from "@/lib/postmark";
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
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    return {
      error: "not authorized",
    };
  }
  if (currentUser.role !== "admin") {
    return {
      error: "not authorized",
    };
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  redirect("/admin/user");
  return;
}

export async function inviteUser(email: string, name = "", role = "user") {
  const session = await getServerSession();
  const currentUser = session?.user;

  if (currentUser?.role !== "admin") {
    return {
      error: "not authorized",
    };
  }

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

  await prisma.invitation.create({
    data: {
      email,
      name,
      role,
    },
  });

  sendInvitationMail({ to: email, name });

  redirect("/admin/user");
}

export async function getInvitations() {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }
  if (currentUser.role !== "admin") {
    throw new Error("not authorized");
  }

  return await prisma.invitation.findMany({
    select: { id: true, email: true, role: true, name: true },
  });
}

export async function deleteInvitation(id: string) {
  await prisma.invitation.delete({ where: { id } });
  revalidatePath("/user");
}
