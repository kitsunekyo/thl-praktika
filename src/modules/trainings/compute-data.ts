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
  if (new Date() > training.end) {
    return training;
  }

  if (!training.address) {
    return training;
  }

  const user = await getMyProfile();
  if (!user) {
    throw new AuthorizationError();
  }

  if (user.role !== "user") {
    return training;
  }

  if (!user.address) {
    return training;
  }

  if (user.address === training.address) {
    return training;
  }

  if (training.address.includes("https://")) {
    return training;
  }

  const traveltime = await getTraveltime(user.address, training.address);

  return {
    ...training,
    traveltime,
  };
}
