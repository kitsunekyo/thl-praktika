import { format } from "date-fns";
import { BanIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { TrainingForm } from "./TrainingForm";
import { deleteTraining, getMyTrainings } from "../actions";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role === "user") {
    redirect("/");
  }

  const myTrainings = await getMyTrainings();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h1 className="mb-3 text-xl font-semibold">Training eintragen</h1>
        <p className="mb-8 max-w-[70ch] text-sm leading-[1.8] text-gray-500">
          Du hast ein Training bei denen Praktikant:innen von THL dabei sein
          können? Trage es hier ein, damit sie sich dafür anmelden können.
        </p>
        <TrainingForm />
      </div>
      <section>
        <h1 className="mb-6 text-xl font-semibold">Meine Trainings</h1>
        <ul className="space-y-2">
          {myTrainings.map((training) => {
            return (
              <Card key={training.id} className="pt-6 text-sm">
                <CardContent>
                  <dl className="space-y-2">
                    <dd>{training.description}</dd>
                    <dd>{`${format(new Date(training.date), "do MMM yy")} von ${
                      training.startTime
                    } bis ${training.endTime}`}</dd>
                  </dl>
                </CardContent>
                <CardFooter>
                  <div>
                    {training.registrations.length}/{training.maxInterns}{" "}
                    Praktikant:innen angemeldet
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <form action={deleteTraining}>
                      <input type="hidden" name="id" value={training.id} />
                      <Button variant="ghost" size="sm">
                        <BanIcon className="mr-2 h-4 w-4" /> Absagen
                      </Button>
                    </form>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </ul>
      </section>
    </div>
  );
}