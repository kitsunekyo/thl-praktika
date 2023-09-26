"use server";

import { compare, hash } from "bcrypt";

import { prisma } from "@/lib/prisma";

export async function getIsTokenValid(id: string) {
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

export async function resetPassword(
  tokenId: string,
  tokenValue: string,
  newPassword: string,
) {
  const isTokenValid = await getIsTokenValid(tokenId);

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
