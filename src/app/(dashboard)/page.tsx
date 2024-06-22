import { redirect } from "next/navigation";

import { AuthorizationError } from "@/lib/errors";
import { getServerSession } from "@/modules/auth/next-auth";
import { getMyTeams } from "@/modules/teams/queries";

export default async function Page() {
  const session = await getServerSession();

  if (!session) {
    throw new AuthorizationError();
  }

  const teams = await getMyTeams();
  const defaultTeam = teams[0];

  return redirect(`/teams/${defaultTeam.id}`);
}
