import { getServerSession } from "next-auth";
import { TrainingForm } from "./training-form";
import { TrainingList } from "./training-list";
import { AuthHeader } from "./auth-header";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container">
        <AuthHeader session={session} />
        <div className="grid grid-cols-2 gap-8">
          <TrainingForm />
          <TrainingList />
        </div>
      </div>
    </main>
  );
}
