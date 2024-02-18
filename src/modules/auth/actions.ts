"use server";

import { compare, hash } from "bcrypt";
import { nanoid } from "nanoid";

import { sendForgotPasswordMail } from "@/lib/postmark";
import { prisma } from "@/lib/prisma";

export async function forgotPassword(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    console.error("User not found");
    return;
  }

  const secret = nanoid(32);
  const hashedSecret = await hash(secret, 12);
  const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const token = await prisma.passwordResetToken.create({
    data: {
      email: user.email,
      secret: hashedSecret,
      expires: expirationDate,
    },
  });
  try {
    sendForgotPasswordMail({
      to: user.email,
      tokenId: token.id,
      tokenValue: secret,
    });
  } catch (e) {
    console.error(e);
  }
}
export async function resetPassword(
  tokenId: string,
  tokenValue: string,
  newPassword: string,
) {
  const isTokenValid = await validatePasswordResetToken(tokenId);

  if (!isTokenValid) {
    console.error("invalid password reset token");
    return { error: "token invalid" };
  }

  const tokenItem = await prisma.passwordResetToken.findFirst({
    where: {
      id: tokenId,
    },
  });

  if (!tokenItem) {
    console.error("password reset token not found");
    return { error: "token invalid" };
  }

  const isSecretCorrect = await compare(tokenValue, tokenItem.secret);
  if (!isSecretCorrect) {
    console.error("password reset token secret incorrect");
    return { error: "token invalid" };
  }

  await prisma.user.update({
    where: {
      email: tokenItem.email,
    },
    data: {
      password: await hash(newPassword, 12),
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: tokenItem.id,
    },
  });
}

export async function signup({
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

export async function validatePasswordResetToken(id: string) {
  const passwordResetToken = await prisma.passwordResetToken.findFirst({
    where: {
      id,
    },
  });

  if (!passwordResetToken) {
    return false;
  }

  if (passwordResetToken.expires < new Date()) {
    return false;
  }

  return true;
}
