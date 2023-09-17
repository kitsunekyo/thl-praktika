import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MinusSquare, PlusSquare, TrashIcon } from "lucide-react";
import { deleteTraining, register, unregister } from "./training-actions";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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
      <h1 className="text font-semibold mb-2">Trainings</h1>
      <ul className="space-y-2">
        {trainings.map((training) => {
          const isRegistered = training.registrations.some(
            (r) => r.userId === session?.user.id
          );
          return (
            <li
              key={training.id}
              className="border border-solid rounded text-sm p-4"
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
              <footer className="flex gap-4 pt-4 border-t mt-4 items-center">
                <div className="flex gap-2 items-center">
                  <Avatar>
                    {!!training.author.image && (
                      <AvatarImage src={training.author.image} />
                    )}
                    <AvatarFallback>{training.author.name}</AvatarFallback>
                  </Avatar>
                  <dd>{training.author.name}</dd>
                </div>
                <div className="ml-auto flex gap-2 items-center">
                  {role !== "trainer" && isRegistered ? (
                    <form action={unregister}>
                      <input type="hidden" name="id" value={training.id} />
                      <Button variant="ghost" size="sm">
                        <MinusSquare className="h-4 w-4 mr-2" />
                        Abmelden
                      </Button>
                    </form>
                  ) : (
                    <form action={register}>
                      <input type="hidden" name="id" value={training.id} />
                      <Button variant="ghost" size="sm">
                        <PlusSquare className="h-4 w-4 mr-2" />
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
