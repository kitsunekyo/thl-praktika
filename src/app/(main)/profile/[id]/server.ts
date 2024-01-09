import { prisma } from "@/lib/prisma";

export async function getProfileById(id: string) {
  const profile = prisma.user.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      image: true,
      role: true,
      address: true,
      city: true,
      zipCode: true,
      phone: true,
    },
  });

  return profile;
}
