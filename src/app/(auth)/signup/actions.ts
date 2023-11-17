"use server";

import { hash } from "bcrypt";

import { prisma } from "@/lib/prisma";

export async function register({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  const invitation = await prisma.invitation.findFirst({
    where: {
      email,
    },
  });

  if (!invitation) {
    console.error(`no invitation found for ${email}`);
    return {
      error: "No invitation found",
    };
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: invitation.role,
    },
  });

  await prisma.invitation.delete({
    where: {
      id: invitation.id,
    },
  });
}

export async function validateInvitation(id: string) {
  const invitation = await prisma.invitation.findFirst({
    where: {
      id,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    },
  });

  if (!invitation) {
    return false;
  }

  return true;
}
