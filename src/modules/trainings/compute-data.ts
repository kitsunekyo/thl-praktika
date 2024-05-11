import { Training } from "@prisma/client";

import { AuthorizationError } from "@/lib/errors";
import { PublicUser } from "@/lib/prisma";
import { getTraveltime } from "@/modules/users/address";

import { getMyProfile } from "../users/queries";

type WithAuthor<T> = T & {
  author: PublicUser;
};

/**
 * @param duration in milliseconds
 */
export function computeDuration<T extends Training>(training: T) {
  return {
    ...training,
    duration: training.end.getTime() - training.start.getTime(),
  };
}

export async function computeTraveltime<T extends WithAuthor<Training>>(
  training: T,
) {
  const user = await getMyProfile();
  if (!user) {
    throw new AuthorizationError();
  }
  const traveltime = await getTraveltime(user.address, training.address);

  return {
    ...training,
    traveltime,
  };
}
