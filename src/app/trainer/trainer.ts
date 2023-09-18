import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

import { authOptions, getSession } from "../api/auth/[...nextauth]/route";

export async function getTrainings() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return [];
  }

  return prisma.training.findMany({
    where: {
      authorId: session.user.id,
    },
  });
}
