"use server";

import { hash } from "bcrypt";
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

  sendForgotPasswordMail({
    to: user.email,
    tokenId: token.id,
    tokenValue: secret,
  });
}
