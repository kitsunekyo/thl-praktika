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

export async function getInvitations() {
  return await prisma.invitation.findMany();
}

export async function deleteInvitation(id: string) {
  await prisma.invitation.delete({ where: { id } });
  revalidatePath("/admin/invitations");
}
