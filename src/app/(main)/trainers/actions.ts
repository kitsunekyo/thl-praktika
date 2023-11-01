"use server";

import { prisma } from "@/lib/prisma";

export async function getTrainers() {
  return await prisma.user.findMany({
    where: { role: "trainer" },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      address: true,
      city: true,
      zipCode: true,
      phone: true,
    },
  });
}
