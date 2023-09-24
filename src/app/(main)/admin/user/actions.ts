"use server";

import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { sendInvitationMail } from "@/lib/postmark";
import { prisma } from "@/lib/prisma";

export async function getUsers() {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/user");
  } catch {
    return {
      error: "something went wrong",
    };
  }
}

export async function createUser(
  email: string,
  password: string,
  name?: string,
  role = "user",
) {
  try {
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
  } catch {
    return {
      error: "something went wrong",
    };
  }
}

export async function inviteUser(email: string, name = "", role = "user") {
  try {
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
  } catch {
    return {
      error: "something went wrong",
    };
  }
}

export async function getInvitations() {
  return await prisma.invitation.findMany();
}

export async function deleteInvitation(id: string) {
  try {
    await prisma.invitation.delete({ where: { id } });
    revalidatePath("/user");
  } catch {
    return {
      error: "something went wrong",
    };
  }
}
