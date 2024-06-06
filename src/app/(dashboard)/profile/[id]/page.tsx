import { differenceInDays } from "date-fns";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";

import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/modules/auth/next-auth";
import { getTrainingRequests } from "@/modules/trainers/queries";
import { RequestTrainingDialog } from "@/modules/trainings/components/RequestTrainingDialog";
import { TrainingListWithDateFilter } from "@/modules/trainings/components/TrainingList";
import { getTrainingsByAuthor } from "@/modules/trainings/queries";
import { getProfileById } from "@/modules/users/queries";

const REQUEST_COOLDOWN_IN_DAYS = 7;

export default async function Page({
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
        {profile.role === "trainer" && (
          <BreadcrumbsItem href="/trainers">Trainer:innen</BreadcrumbsItem>
        )}
        {profile.role === "user" && (
          <BreadcrumbsItem href="/users">Praktikanten</BreadcrumbsItem>
        )}
        {profile.role === "admin" && (
          <BreadcrumbsItem href="/admin/users">Admins</BreadcrumbsItem>
        )}
        <BreadcrumbsSeparator />
        <BreadcrumbsItem href={`/profile/${id}`}>
          {profile.name}
        </BreadcrumbsItem>
      </Breadcrumbs>
      <article className="max-w-2xl py-6">
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
              {profile.description && (
                <TableRow>
                  <TableHead>Beschreibung</TableHead>
                  <TableData>
                    <span>{profile.description}</span>
                  </TableData>
                </TableRow>
              )}
            </tbody>
          </table>
        </div>
        {session.user.role === "user" && profile.role === "trainer" && (
          <RequestTrainingButton
            userId={session.user.id}
            trainerId={profile.id}
          />
        )}
        {profile.role === "trainer" && <Trainings trainerId={id} />}
      </article>
    </>
  );
}

function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="grid grid-cols-3 gap-4 py-3">{children}</tr>;
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
    <td className="col-span-2 text-sm leading-6 text-gray-700">{children}</td>
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

async function RequestTrainingButton({
  userId,
  trainerId,
}: {
  userId: string;
  trainerId: string;
}) {
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
    <RequestTrainingDialog trainerId={trainerId}>
      <Button size="sm" variant="outline">
        Praktikum anfragen
      </Button>
    </RequestTrainingDialog>
  );
}

async function Trainings({ trainerId }: { trainerId: string }) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const trainings = await getTrainingsByAuthor(trainerId);

  return (
    <section className="my-12 space-y-2">
      <h2 className="text-lg font-semibold">Praktika</h2>
      <TrainingListWithDateFilter trainings={trainings} user={session.user} />
    </section>
  );
}
