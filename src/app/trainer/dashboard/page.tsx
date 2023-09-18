// trainings erstellen
// erstellte trainings sehen und bearbeiten

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TrainingForm } from "@/app/training-form";
import { TrainingList } from "@/app/training-list";

import { getTrainings } from "../trainer";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role === "user") {
    redirect("/");
  }

  const trainings = await getTrainings();

  return (
    <div className="grid grid-cols-2 gap-8">
      <TrainingForm />
      <TrainingList />
    </div>
  );
}
