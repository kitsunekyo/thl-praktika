import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function UserPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <code>{JSON.stringify(session, null, 2)}</code>
    </div>
  );
}
