"use server";

import { prisma } from "@/lib/prisma";

export async function getUserProfiles() {
  return await prisma.user.findMany({
    where: {
      role: "user",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      address: true,
      city: true,
      zipCode: true,
      lastLogin: true,
      image: true,
    },
  });
}
