import { getDirections } from "@/lib/mapquest";

/**
 * @returns traveltime in seconds
 */
export async function getTraveltime(fromAddress: string, toAddress: string) {
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
