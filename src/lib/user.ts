import { User } from "@prisma/client";

import { getDirections } from "./mapquest";

export function formatUserAddress(
  user: Pick<User, "address" | "city" | "zipCode">,
) {
  return [user.address, [user.zipCode, user.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

/**
 * @returns traveltime in seconds
 */
export async function getTraveltime(
  fromUser: Pick<User, "id" | "address" | "city" | "zipCode">,
  toUser: Pick<User, "id" | "address" | "city" | "zipCode">,
) {
  if (fromUser.id === toUser.id) {
    return 0;
  }
  const fromAddress = formatUserAddress(fromUser);
  const toAddress = formatUserAddress(toUser);

  if (!fromAddress || !toAddress) {
    return;
  }

  if (process.env.NODE_ENV === "development") {
    return 4855; // 1h 2min
  }

  const directions = await getDirections(fromAddress, toAddress);

  if (directions.info.statuscode !== 0) {
    return;
  }

  return directions.route.time;
}
