import { MapPinIcon } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "@/modules/auth/next-auth";
import { getInitials } from "@/modules/users/name";
import { getUserProfiles } from "@/modules/users/queries";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/users">Praktikanten</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle
          content={
            <p>
              Hier findest du alle Praktikanten, die sich auf dieser Seite
              registriert haben.
            </p>
          }
        >
          Praktikanten
        </PageTitle>
        <div className="max-w-4xl">
          <NewUserList />
        </div>
      </div>
    </>
  );
}

async function NewUserList() {
  const users = await getUserProfiles();

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {users.map((user) => {
        return (
          <li key={user.email} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 items-start gap-x-4">
              <Link
                href={`/profile/${user.id}`}
                className="shrink-0 leading-[0]"
              >
                <Avatar size="lg">
                  <AvatarImage src={user.image || "/img/avatar.jpg"} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <Link
                    href={`/profile/${user.id}`}
                    className="hover:underline"
                  >
                    {user.name}
                  </Link>
                </p>
                <div className="mt-1 flex text-xs leading-5 text-gray-500">
                  <a
                    href={`mailto:${user.email}`}
                    className="min-w-0 truncate hover:underline md:max-w-64"
                  >
                    {user.email}
                  </a>
                  {!!user.phone && (
                    <div className="min-w-0 shrink-0 truncate">
                      <span className="mx-2">•</span>
                      <a href={`tel:${user.phone}`} className="hover:underline">
                        {user.phone}
                      </a>
                    </div>
                  )}
                  {!!user.address && (
                    <div className="hidden min-w-0 items-center md:flex">
                      <span className="mx-2">•</span>
                      <MapPinIcon className="h-3 w-3 shrink-0" />
                      <p className="ml-1 truncate">{user.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
