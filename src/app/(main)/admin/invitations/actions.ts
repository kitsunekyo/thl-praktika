"use server";

import { revalidatePath } from "next/cache";

import { sendInvitationMail } from "@/lib/postmark";
import { prisma } from "@/lib/prisma";

export async function inviteUser(
  email: string,
  name = "",
  role: "user" | "trainer" | "admin" = "user",
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
  sendInvitationMail({ to: email, name, role });
}

export async function getInvitations() {
  return await prisma.invitation.findMany();
}

export async function deleteInvitation(id: string) {
  await prisma.invitation.delete({ where: { id } });
  revalidatePath("/admin/invitations");
}
