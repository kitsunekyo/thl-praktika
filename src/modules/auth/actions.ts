"use server";

import { captureException } from "@sentry/nextjs";
import { compare, hash } from "bcrypt";
import { nanoid } from "nanoid";

import { AuthorizationError, InputError, NotFoundError } from "@/lib/errors";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export async function forgotPassword(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundError();
  }

  const secret = nanoid(32);
  const hashedSecret = await hash(secret, 12);
  const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const token = await prisma.passwordResetToken
    .create({
      data: {
        email: user.email,
        secret: hashedSecret,
        expires: expirationDate,
      },
    })
    .catch((e) => {
      captureException(e);
      throw new Error("could not create password reset token");
    });

  if (!token) {
    throw new Error("could not create password reset token");
  }

  sendMail({
    templateName: "forgot-password",
    to: user.email,
    data: {
      action_url: `${process.env.NEXTAUTH_URL}/reset-password?t=${token.id}&v=${secret}`,
    },
  }).catch((e) => {
    captureException(e);
  });
}
export async function resetPassword(
  tokenId: string,
  tokenValue: string,
  newPassword: string,
) {
  const isTokenValid = await validatePasswordResetToken(tokenId);

  if (!isTokenValid) {
    console.error("invalid password reset token");
    throw new InputError();
  }

  const tokenItem = await prisma.passwordResetToken.findFirst({
    where: {
      id: tokenId,
    },
  });

  if (!tokenItem) {
    console.error("password reset token not found");
    throw new NotFoundError();
  }

  const isSecretCorrect = await compare(tokenValue, tokenItem.secret);
  if (!isSecretCorrect) {
    console.error("password reset token secret incorrect");
    throw new InputError();
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
    throw new AuthorizationError();
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
