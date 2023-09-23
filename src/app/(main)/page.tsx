import { User } from "@prisma/client";
import { formatDuration } from "date-fns";

import { PageTitle } from "@/components/PageTitle";
import { TrainingCard } from "@/components/TrainingCard";
import { getDuration, secondsToDuration } from "@/lib/date";
import { getDirections } from "@/lib/mapquest";
import { getServerSession } from "@/lib/next-auth";

import { getMe } from "./profile/actions";
import { TrainingFilter } from "./TrainingFilter";
import { getTrainings } from "../register";
import { RegisterButton, UnregisterButton } from "../register-buttons";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession();
  const role = session?.user.role;
  const filteredTrainings = await filterTrainings({ searchParams });

  let content = <p>Keine Trainings gefunden</p>;
  if (filteredTrainings.length > 0) {
    content = (
      <ul className="space-y-4 md:w-full md:max-w-[600px]">
        {filteredTrainings.map((training) => (
          <li key={training.id}>
            <TrainingCard
              training={training}
              actions={
                role === "trainer" ? null : training.isRegistered ? (
                  <UnregisterButton trainingId={training.id} />
                ) : training.maxInterns - training.registrations.length > 0 ? (
                  <RegisterButton trainingId={training.id} />
                ) : null
              }
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section>
      <div className="gap-8 md:flex">
        <aside className="relative mb-8 shrink-0 basis-80">
          <div className="sticky top-12">
            <PageTitle>Praktika</PageTitle>
            <TrainingFilter />
          </div>
        </aside>
        {content}
      </div>
    </section>
  );
}

function getUserAddress(user: Pick<User, "address" | "city" | "zipCode">) {
  return [user.address, [user.zipCode, user.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

async function getTraveltimeToUser(
  fromUser: Pick<User, "id" | "address" | "city" | "zipCode">,
  toUser: Pick<User, "id" | "address" | "city" | "zipCode">,
) {
  if (fromUser.id === toUser.id) {
    return;
  }
  const fromAddress = getUserAddress(fromUser);
  const toAddress = getUserAddress(toUser);

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

async function filterTrainings({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const me = await getMe();
  if (!me) {
    return [];
  }
  const userId = me.id;

  const { traveltime, duration, free } = searchParams;
  const parsedTraveltime =
    typeof traveltime === "string" ? parseInt(traveltime) : undefined;
  const parsedDuration =
    typeof duration === "string" ? parseInt(duration) : undefined;
  const parsedFree = typeof free === "string" ? parseInt(free) : undefined;

  const baseTrainings = await getTrainings();
  const trainings = await Promise.all(
    baseTrainings.map(async (training) => ({
      ...training,
      traveltime: await getTraveltimeToUser(training.author, me),
      duration: getDuration(training.startTime, training.endTime),
      isRegistered: training.registrations.some((r) => r.userId === userId),
    })),
  );

  return trainings.filter((t) => {
    if (parsedDuration && t.duration < parsedDuration * 60 * 60) {
      return false;
    }
    if (parsedFree && t.maxInterns - t.registrations.length < parsedFree) {
      return false;
    }
    if (!parsedTraveltime) {
      return true;
    }
    if (t.traveltime && t.traveltime.time > parsedTraveltime * 60) {
      return false;
    }
    return true;
  });
}
