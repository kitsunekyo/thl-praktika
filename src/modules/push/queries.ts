import { prisma } from "@/lib/prisma";

import { subscriptionSchema } from "./schema";
import { auth } from "../auth/next-auth";

export async function getMySubscription() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("not authorized");
  }

  const data = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
    },
  });

  return subscriptionSchema.parse(data);
}
