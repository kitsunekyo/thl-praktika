import { Training } from "@prisma/client";

import { SafeUser } from "@/lib/prisma";
import { getTraveltime } from "@/modules/users/address";

import { getMyProfile } from "../users/queries";

type WithAuthor<T> = T & {
  author: SafeUser;
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

  const traveltime = user
    ? await getTraveltime(user, training.author)
    : undefined;

  return {
    ...training,
    traveltime,
  };
}
