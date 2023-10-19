"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function deleteRegistration(id: string) {
  await prisma.registration.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/registrations");
}
