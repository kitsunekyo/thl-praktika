"use server";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";

import { sendTemplateMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

import { getServerSession } from "../auth/next-auth";

export async function deleteUser(id: string) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    return { error: "not authorized" };
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role = "user",
) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    return { error: "not authorized" };
  }
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

export async function inviteUser({
  email,
  name,
  role = "user",
  phone = "",
  address = "",
  shouldSendEmail = false,
}: {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role?: "user" | "trainer" | "admin";
  shouldSendEmail?: boolean;
}) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    return { error: "not authorized" };
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

  const inv = await prisma.invitation.create({
    data: {
      email,
      name,
      role,
      address,
      phone,
    },
  });

  if (!inv) {
    return {
      error: "could not create invitation",
    };
  }
  revalidatePath("/admin/invitations");
  if (!shouldSendEmail) {
    return;
  }

  sendTemplateMail({
    to: email,
    templateName: role === "trainer" ? "trainer-invitation" : "user-invitation",
    data: {
      invite_sender_name: "Alex",
      action_url: `${process.env.NEXTAUTH_URL}/signup?email=${email}&name=${encodeURIComponent(name)}&id=${inv.id}`,
    },
  });
}

export async function resendInvitation(id: string) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    return { error: "not authorized" };
  }
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

  sendTemplateMail({
    to: invitation.email,
    templateName:
      invitation.role === "trainer" ? "trainer-invitation" : "user-invitation",
    data: {
      invite_sender_name: "Alex",
      action_url: `${process.env.NEXTAUTH_URL}/signup?email=${invitation.email}&name=${encodeURIComponent(invitation.name || "")}&id=${invitation.id}`,
    },
  });

  revalidatePath("/admin/invitations");
}

export async function deleteInvitation(id: string) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    return { error: "not authorized" };
  }
  await prisma.invitation.delete({ where: { id } });
  revalidatePath("/admin/invitations");
}
