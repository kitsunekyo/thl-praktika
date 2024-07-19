import { Training } from "@prisma/client";

import { AuthorizationError } from "@/lib/errors";
import { getTraveltime } from "@/modules/users/address";

import { WithAuthor } from "./types";
import { getMyProfile } from "../users/queries";

/**
 * @param duration in milliseconds
 */
export function computeDuration<T extends Pick<Training, "end" | "start">>(
  training: T,
) {
  return {
    ...training,
    duration: training.end.getTime() - training.start.getTime(),
  };
}

export async function computeTraveltime<
  T extends Pick<Training, "end" | "address"> & WithAuthor,
>(
  training: T,
): Promise<
  T & {
    traveltime?: number;
  }
> {
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

export type WithDurationAndTraveltime<T extends Training & WithAuthor> =
  Awaited<ReturnType<typeof addMetadata<T>>>;

export async function addMetadata<T extends Training & WithAuthor>(
  trainings: T[],
) {
  return Promise.all(
    trainings.map((training) => computeTraveltime(computeDuration(training))),
  );
}
