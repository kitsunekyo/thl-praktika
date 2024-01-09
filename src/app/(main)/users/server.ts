"use server";

import { prisma } from "@/lib/prisma";

export async function getUserProfiles() {
  return await prisma.user.findMany({
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
    },
  });
}
