import { User } from "@prisma/client";

export function formatUserAddress(
  user: Pick<User, "address" | "city" | "zipCode">,
) {
  return [user.address, [user.zipCode, user.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}
