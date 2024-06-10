import { AuthorizationError } from "@/lib/errors";
import { prisma, selectPublicUser } from "@/lib/prisma";

import { getServerSession } from "../auth/next-auth";

export async function getMyTeams() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new AuthorizationError();
  }

  return prisma.team.findMany({
    where: {
      OR: [
        {
          ownerId: session.user.id,
        },
        {
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      ],
    },
  });
}

export async function getTeam(id: string) {
  const session = await getServerSession();
  if (!session) {
    throw new AuthorizationError();
  }

  return prisma.team.findFirst({
    where: {
      id,
      OR: [
        {
          ownerId: session.user.id,
        },
        {
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      ],
    },
    include: {
      license: true,
      owner: {
        select: selectPublicUser,
      },
      users: {
        select: selectPublicUser,
      },
    },
  });
}
