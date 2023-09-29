import { Registration, Training, User } from "@prisma/client";

import { getTraveltime } from "@/lib/user";

import { getProfile } from "../app/(main)/profile/actions";

type WithRegistrations<T> = T & { registrations: Registration[] };
type WithAuthor<T> = T & { author: Omit<User, "password"> };

/**
 * @param duration in milliseconds
 */
export function computeDuration<T extends Training>(training: T) {
  return {
    ...training,
    duration: training.end.getTime() - training.start.getTime(),
  };
}

export async function computeIsRegistered<
  T extends WithRegistrations<Training>,
>(training: T) {
  const user = await getProfile();

  return {
    ...training,
    isRegistered: user
      ? training.registrations.some((r) => r.userId === user.id)
      : false,
  };
}

export async function computeTraveltime<T extends WithAuthor<Training>>(
  training: T,
) {
  const user = await getProfile();

  const traveltime = user
    ? await getTraveltime(user, training.author)
    : undefined;

  return {
    ...training,
    traveltime,
  };
}
