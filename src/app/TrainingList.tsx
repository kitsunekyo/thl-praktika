import { revalidatePath } from "next/cache";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatTrainingDate } from "@/lib/date";
import { getServerSession } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";

async function register(formData: FormData) {
  "use server";
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }

  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("No id provided");
  }

  const isRegisteredAlready =
    (await prisma.registration.findFirst({
      where: {
        userId: currentUser.id,
        id: id,
      },
    })) !== null;

  if (isRegisteredAlready) {
    throw new Error("Already registered");
  }

  await prisma.registration.create({
    data: {
      trainingId: id,
      userId: currentUser.id,
    },
  });
  revalidatePath("/");
}

async function unregister(formData: FormData) {
  "use server";
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("must be authenticated");
  }

  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("No id provided");
  }

  const registration = await prisma.registration.findFirst({
    where: {
      trainingId: id,
      userId: currentUser.id,
    },
  });

  if (!registration) {
    throw new Error("Did not find registration");
  }

  await prisma.registration.delete({
    where: {
      id: registration.id,
    },
  });

  revalidatePath("/");
}

export async function TrainingList() {
  const session = await getServerSession();
  const userId = session?.user.id;

  const trainings = await prisma.training.findMany({
    include: {
      author: true,
      registrations: true,
    },
  });

  return (
    <section>
      <h1 className="mb-3 text-xl font-semibold">Praktika</h1>
      <p className="mb-8 max-w-[70ch] text-sm leading-[1.8] text-gray-500">
        Melde dich für Praktika bei THL Trainer:innen an.
      </p>
      <ul className="space-y-2">
        {trainings.map((training) => {
          const isRegistered = training.registrations.some(
            (r) => r.userId === userId,
          );
          return (
            <li
              key={training.id}
              className="rounded border border-solid p-4 text-sm"
            >
              <dl className="space-y-2">
                <dd>{training.description}</dd>
                <dd>
                  {formatTrainingDate(
                    training.date,
                    training.startTime,
                    training.endTime,
                  )}
                </dd>
                <dd>
                  {training.registrations.length}/{training.maxInterns}{" "}
                  Praktikanten angemeldet
                </dd>
              </dl>
              <footer className="mt-4 flex items-center gap-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={training.author.image || "/img/avatar.jpg"}
                    />
                    <AvatarFallback>
                      {getInitials(training.author)}
                    </AvatarFallback>
                  </Avatar>
                  <dd className="hidden md:block">{training.author.email}</dd>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {isRegistered ? (
                    <form action={unregister}>
                      <input type="hidden" name="id" value={training.id} />
                      <Button variant="ghost" size="sm">
                        Abmelden
                      </Button>
                    </form>
                  ) : (
                    <form action={register}>
                      <input type="hidden" name="id" value={training.id} />
                      <Button variant="secondary" size="sm">
                        Anmelden
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
