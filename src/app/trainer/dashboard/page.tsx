import { format } from "date-fns";
import { TrashIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";

import { TrainingForm } from "./TrainingForm";
import { deleteTraining, getMyTrainings } from "../actions";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role === "user") {
    redirect("/");
  }

  const myTrainings = await getMyTrainings();

  return (
    <div className="grid grid-cols-2 gap-8">
      <TrainingForm />

      <section>
        <h1 className="text mb-2 font-semibold">Trainings</h1>
        <ul className="space-y-2">
          {myTrainings.map((training) => {
            return (
              <li
                key={training.id}
                className="rounded border border-solid p-4 text-sm"
              >
                <dl className="space-y-2">
                  <dd>{training.description}</dd>
                  <dd>{`${format(new Date(training.date), "do MMM yy")} von ${
                    training.startTime
                  } bis ${training.endTime}`}</dd>
                  <dd>
                    {training.registrations.length}/{training.maxInterns}{" "}
                    Praktikanten angemeldet
                  </dd>
                </dl>
                <footer className="mt-4 flex items-center gap-4 border-t pt-4">
                  <dd>{training.author.email}</dd>
                  <div className="ml-auto flex items-center gap-2">
                    <form action={deleteTraining}>
                      <input type="hidden" name="id" value={training.id} />
                      <Button variant="ghost" size="icon">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </footer>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
