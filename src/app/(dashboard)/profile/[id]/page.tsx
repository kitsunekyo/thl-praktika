import { differenceInDays } from "date-fns";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";

import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "@/components/Breadcrumbs";
import { SafeUser } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/next-auth";
import { getTrainingRequests } from "@/modules/trainers/queries";
import { RequestTraining } from "@/modules/trainings/components/RequestTraining";
import { TrainingListWithDateFilter } from "@/modules/trainings/components/TrainingList";
import { getTrainingsByAuthor } from "@/modules/trainings/queries";
import { getProfileById } from "@/modules/users/queries";

const REQUEST_COOLDOWN_IN_DAYS = 7;

export default async function Profile({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const profile = await getProfileById(id);
  const roleLabel = profile.role === "trainer" ? "Trainer:in" : "Praktikant:in";

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/profile">Profil</BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem href={`/profile/${id}`}>
          {profile.name || profile.email}
        </BreadcrumbsItem>
      </Breadcrumbs>
      <article className="mx-auto max-w-[600px] py-6">
        <div className="mb-6 space-y-4">
          <ProfileImage src={profile.image} />
          <header>
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <div className="text-sm text-gray-500">{roleLabel}</div>
          </header>
          <table className="mt-6 divide-y divide-gray-100">
            <tbody>
              <TableRow>
                <TableHead>E-Mail</TableHead>
                <TableData>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center underline"
                  >
                    <span className="truncate">{profile.email}</span>
                    <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0" />
                  </a>
                </TableData>
              </TableRow>
              <TableRow>
                <TableHead>Telefonnummer</TableHead>
                <TableData>
                  {profile.phone ? (
                    <a
                      href={`mailto:${profile.phone}`}
                      className="flex items-center underline"
                    >
                      <span className="truncate">{profile.phone}</span>
                      <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0" />
                    </a>
                  ) : (
                    <span className="italic text-muted-foreground">
                      noch nicht ausgefüllt
                    </span>
                  )}
                </TableData>
              </TableRow>
              <TableRow>
                <TableHead>Adresse</TableHead>
                <TableData>
                  {profile.address ? (
                    <span>{profile.address}</span>
                  ) : (
                    <span className="italic text-muted-foreground">
                      noch nicht ausgefüllt
                    </span>
                  )}
                </TableData>
              </TableRow>
            </tbody>
          </table>
        </div>
        <RequestTrainingWrapper
          userId={session.user.id}
          trainerId={id}
          role={profile.role}
        />
        {profile.role === "trainer" && (
          <Trainings trainerId={id} user={session.user} />
        )}
      </article>
    </>
  );
}

function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">{children}</tr>;
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left text-sm font-medium leading-6 text-gray-900">
      {children}
    </th>
  );
}

function TableData({ children }: { children: React.ReactNode }) {
  return (
    <td className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
      {children}
    </td>
  );
}

function ProfileImage({ src }: { src: string | null }) {
  return (
    <div className="relative h-[120px] w-[120px]">
      <Image
        fill
        priority
        src={src || "/img/avatar.jpg"}
        alt="Profilbild"
        sizes="120px"
        className="overflow-hidden rounded-full object-cover"
      />
    </div>
  );
}

async function RequestTrainingWrapper({
  userId,
  trainerId,
  role,
}: {
  userId: string;
  trainerId: string;
  role: string;
}) {
  if (role === "user") {
    return null;
  }

  const requests = await getTrainingRequests({ trainerId, userId });
  const hasRecentlyRequested = Boolean(
    requests
      .filter((r) => r.trainerId === trainerId)
      .find(
        (r) =>
          differenceInDays(new Date(), new Date(r.createdAt)) <
          REQUEST_COOLDOWN_IN_DAYS,
      ),
  );

  return (
    <RequestTraining trainerId={trainerId} disabled={hasRecentlyRequested} />
  );
}

async function Trainings({
  trainerId,
  user,
}: {
  trainerId: string;
  user: Pick<SafeUser, "id" | "role">;
}) {
  const trainings = await getTrainingsByAuthor(trainerId);

  return (
    <section className="my-12">
      <h2 className="mb-2 font-medium">Praktika</h2>
      <TrainingListWithDateFilter trainings={trainings} user={user} />
    </section>
  );
}
