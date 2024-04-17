import { getDirections } from "@/lib/mapquest";

/**
 * @returns traveltime in seconds
 */
export async function getTraveltime(
  fromAddress: string | null,
  toAddress: string | null,
) {
  if (fromAddress === toAddress || !fromAddress || !toAddress) {
    return 0;
  }

  const directions = await getDirections(fromAddress, toAddress);

  if (directions.info.statuscode !== 0) {
    return 0;
  }

  return directions.route.time;
}
