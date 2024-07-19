import { getDirections } from "@/lib/mapquest";

/**
 * @returns traveltime in seconds
 */
export async function getTraveltime(from: string, to: string) {
  const directions = await getDirections(from, to);

  if (directions.info.statuscode !== 0) {
    return 0;
  }

  return directions.route.time;
}
