import { User } from "@prisma/client";
import { formatDuration } from "date-fns";

import { PageTitle } from "@/components/PageTitle";
import { TrainingCard } from "@/components/TrainingCard";
import { secondsToDuration } from "@/lib/date";
import { getDirections } from "@/lib/mapquest";
import { getServerSession } from "@/lib/next-auth";
import { formatUserAddress } from "@/lib/user";

import { getProfile } from "./profile/actions";
import { RegisterButton, UnregisterButton } from "./register-buttons";
import { TrainingFilter } from "./TrainingFilter";
import { getTrainings } from "../register";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerSession();
  const isTrainer = session?.user.role === "trainer";
  const trainings = await filter({
    trainings: await addMetadata(await getTrainings()),
    filter: {
      traveltime: Number(searchParams.traveltime),
      duration: Number(searchParams.duration),
      free: Number(searchParams.free),
    },
  });

  return (
    <section>
      <div className="gap-8 md:flex">
        <aside className="relative mb-8 shrink-0 basis-80">
          <div className="sticky top-12">
            <PageTitle>Praktika</PageTitle>
            <TrainingFilter />
          </div>
        </aside>
        {trainings.length <= 0 ? (
          <p>Keine Trainings gefunden</p>
        ) : (
          <ul className="space-y-4 md:w-full md:max-w-[600px]">
            {trainings.map((t) => {
              const hasFreeSpots = t.maxInterns - t.registrations.length > 0;
              return (
                <li key={t.id}>
                  <TrainingCard
                    training={t}
                    actions={
                      isTrainer ? null : t.isRegistered ? (
                        <UnregisterButton trainingId={t.id} />
                      ) : (
                        hasFreeSpots && <RegisterButton trainingId={t.id} />
                      )
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

async function getTraveltime(
  fromUser: Pick<User, "id" | "address" | "city" | "zipCode">,
  toUser: Pick<User, "id" | "address" | "city" | "zipCode">,
) {
  if (fromUser.id === toUser.id) {
    return { time: 0, formattedTime: "0 Minuten" };
  }
  const fromAddress = formatUserAddress(fromUser);
  const toAddress = formatUserAddress(toUser);

  if (!fromAddress || !toAddress) {
    return;
  }

  if (process.env.NODE_ENV === "development") {
    return { time: 4855, formattedTime: "1 Stunde 2 Minuten" };
  }

  const directions = await getDirections(fromAddress, toAddress);

  if (directions.info.statuscode !== 0) {
    return;
  }

  return {
    time: directions.route.time,
    formattedTime: formatDuration(secondsToDuration(directions.route.time), {
      format: ["hours", "minutes"],
    }),
  };
}

async function addMetadata(
  trainings: Awaited<ReturnType<typeof getTrainings>>,
) {
  const user = await getProfile();

  return Promise.all(
    trainings.map(async (training) => {
      let traveltime;
      let isRegistered = false;
      if (user) {
        traveltime = await getTraveltime(training.author, user);
        isRegistered = training.registrations.some((r) => r.userId === user.id);
      }
      const duration = training.end.getTime() - training.start.getTime();

      return {
        ...training,
        traveltime,
        duration,
        isRegistered,
      };
    }),
  );
}

async function filter({
  trainings,
  filter,
}: {
  trainings: Awaited<ReturnType<typeof addMetadata>>;
  filter: { traveltime: number; duration: number; free: number };
}) {
  const { traveltime, duration, free } = filter;

  return trainings.filter((t) => {
    if (!Number.isNaN(duration) && t.duration < duration * 60 * 60) {
      return false;
    }
    if (!Number.isNaN(free) && t.maxInterns - t.registrations.length < free) {
      return false;
    }
    if (
      !Number.isNaN(traveltime) &&
      t.traveltime &&
      t.traveltime.time > traveltime * 60
    ) {
      return false;
    }
    return true;
  });
}
