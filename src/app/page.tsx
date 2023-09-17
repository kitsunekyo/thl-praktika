import { getServerSession } from "next-auth";

import { authOptions } from "./api/auth/[...nextauth]/route";
import { AuthHeader } from "./auth-header";
import { TrainingForm } from "./training-form";
import { TrainingList } from "./training-list";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <AuthHeader session={session} />
      <div className="grid grid-cols-2 gap-8">
        <TrainingForm />
        <TrainingList />
      </div>
    </>
  );
}
