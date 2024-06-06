import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "@/components/Breadcrumbs";
import { getServerSession } from "@/modules/auth/next-auth";
import { getTrainerInvitationById } from "@/modules/trainers/queries";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const profile = await getTrainerInvitationById(id);

  if (!profile) {
    return notFound();
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/trainers">Trainer:innen</BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem>Einladungen</BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem href={`/trainers/invitations/${id}`}>
          {profile.name}
        </BreadcrumbsItem>
      </Breadcrumbs>
      <article className="max-w-2xl py-6">
        <div className="mb-6 space-y-4">
          <div className="relative h-[120px] w-[120px]">
            <Image
              fill
              priority
              src="/img/avatar.jpg"
              alt="Profilbild"
              sizes="120px"
              className="overflow-hidden rounded-full object-cover"
            />
          </div>
          <header>
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <div className="text-sm text-gray-500">
              Eingeladene/r Trainer:in - Diese/r Trainer:in hat sich noch nicht
              auf der App registriert.
            </div>
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
              {profile.phone ? (
                <TableRow>
                  <TableHead>Telefon</TableHead>
                  <TableData>
                    <a
                      href={`mailto:${profile.phone}`}
                      className="flex items-center underline"
                    >
                      <span className="truncate">{profile.phone}</span>
                      <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0" />
                    </a>
                  </TableData>
                </TableRow>
              ) : null}
              {profile.address ? (
                <TableRow>
                  <TableHead>Adresse</TableHead>
                  <TableData>
                    <span>{profile.address}</span>
                  </TableData>
                </TableRow>
              ) : null}
            </tbody>
          </table>
        </div>
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
