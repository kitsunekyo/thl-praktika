import { User } from "@prisma/client";

import { getDirections } from "@/lib/mapquest";

export type Address = Pick<User, "address" | "city" | "zipCode">;

export function formatAddress({ address, city, zipCode }: Address) {
  return [address, [zipCode, city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

/**
 * @returns traveltime in seconds
 */
export async function getTraveltime(from: Address, to: Address) {
  const fromAddress = formatAddress(from);
  const toAddress = formatAddress(to);
  if (fromAddress === toAddress) {
    return 0;
  }

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
