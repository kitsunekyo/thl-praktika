import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/getServerSession";

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
export async function getInvitations() {
  return await prisma.invitation.findMany();
}
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
export async function getProfile() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("not authorized");
  }

  return prisma.user.findFirstOrThrow({
    where: {
      id: session.user.id,
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
      preferences: true,
    },
  });
}
