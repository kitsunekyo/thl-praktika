import { User } from "@prisma/client";
import { formatDuration } from "date-fns";
import { redirect } from "next/navigation";

import { TrainingCard } from "@/components/TrainingCard";
import { getDuration, secondsToDuration } from "@/lib/date";
import { getDirections } from "@/lib/mapquest";

import { Filter } from "./Filter";
import { getMe } from "./profile/actions";
import { getTrainings } from "../register";
import { RegisterButton, UnregisterButton } from "../register-buttons";

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
    return { time: 4855, formattedTime: "01:11:20" };
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

async function getFilteredTrainings({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const me = await getMe();
  if (!me) {
    redirect("/login");
  }
  const userId = me.id;

  const { traveltime, duration, free } = searchParams;
  const parsedTraveltime =
    typeof traveltime === "string" ? parseInt(traveltime) : undefined;
  const parsedDuration =
    typeof duration === "string" ? parseInt(duration) : undefined;
  const parsedFree = typeof free === "string" ? parseInt(free) : undefined;

  const trainings = await getTrainings();
  const filtered = trainings
    .map((training) => ({
      ...training,
      // traveltime: getTraveltimeToUser(training.author, me),
      duration: getDuration(training.startTime, training.endTime),
      isRegistered: training.registrations.some((r) => r.userId === userId),
    }))
    .filter((t) => {
      if (parsedDuration && t.duration < parsedDuration * 60 * 60) {
        return false;
      }
      if (parsedFree && t.maxInterns - t.registrations.length < parsedFree) {
        return false;
      }
      if (!parsedTraveltime) {
        return true;
      }
      // const _traveltime = await t.traveltime;
      // if (_traveltime && _traveltime.time > parsedTraveltime * 60) {
      //   return false;
      // }
      return true;
    });

  return filtered;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filteredTrainings = await getFilteredTrainings({ searchParams });

  let content = <p>Keine Trainings gefunden</p>;
  if (filteredTrainings.length > 0) {
    content = (
      <ul className="space-y-2">
        {filteredTrainings.map((training) => (
          <li key={training.id}>
            <TrainingCard
              training={training}
              actions={
                training.isRegistered ? (
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
      <h1 className="mb-6 text-2xl font-semibold md:mb-12">Praktika</h1>
      <div className="gap-8 md:flex">
        <aside className="mb-8 shrink-0 basis-80">
          <Filter />
        </aside>
        {content}
      </div>
    </section>
  );
}
