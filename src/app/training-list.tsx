import { format } from "date-fns";
import { MinusSquare, PlusSquare, TrashIcon } from "lucide-react";
import { getServerSession } from "next-auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { authOptions } from "./api/auth/[...nextauth]/route";
import { deleteTraining, register, unregister } from "./training-actions";

export async function TrainingList() {
  const session = await getServerSession(authOptions);

  const role = session?.user.role;

  const trainings = await prisma.training.findMany({
    include: {
      author: true,
      registrations: true,
    },
  });

  return (
    <section>
      <h1 className="text mb-2 font-semibold">Trainings</h1>
      <ul className="space-y-2">
        {trainings.map((training) => {
          const isRegistered = training.registrations.some(
            (r) => r.userId === session?.user.id,
          );
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
                <div className="flex items-center gap-2">
                  <Avatar>
                    {!!training.author.image && (
                      <AvatarImage src={training.author.image} />
                    )}
                    <AvatarFallback>{training.author.name}</AvatarFallback>
                  </Avatar>
                  <dd>{training.author.name}</dd>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {role !== "trainer" && isRegistered ? (
                    <form action={unregister}>
                      <input type="hidden" name="id" value={training.id} />
                      <Button variant="ghost" size="sm">
                        <MinusSquare className="mr-2 h-4 w-4" />
                        Abmelden
                      </Button>
                    </form>
                  ) : (
                    <form action={register}>
                      <input type="hidden" name="id" value={training.id} />
                      <Button variant="ghost" size="sm">
                        <PlusSquare className="mr-2 h-4 w-4" />
                        Anmelden
                      </Button>
                    </form>
                  )}
                  {role !== "user" && (
                    <form action={deleteTraining}>
                      <input type="hidden" name="id" value={training.id} />
                      <Button variant="ghost" size="icon">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </form>
                  )}
                </div>
              </footer>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
