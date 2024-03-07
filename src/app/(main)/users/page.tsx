import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatAddress } from "@/modules/users/address";
import { getInitials } from "@/modules/users/name";
import { getUserProfiles } from "@/modules/users/queries";

export default async function Page() {
  const users = await getUserProfiles();

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/users">Praktikanten</BreadcrumbsItem>
      </Breadcrumbs>
      <div className="py-6">
        <PageTitle
          content={
            <>
              Hier findest du alle Praktikanten, die sich auf dieser Seite
              registriert haben.
            </>
          }
        >
          Praktikanten
        </PageTitle>
        <UserList users={users} />
      </div>
    </>
  );
}

function UserList({
  users,
}: {
  users: {
    id: string;
    name: string | null;
    address: string | null;
    city: string | null;
    zipCode: string | null;
    phone: string | null;
    email: string;
    lastLogin: Date | null;
    image?: string | null;
  }[];
}) {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {users.map((user) => (
        <li
          key={user.email}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
        >
          <div className="flex min-h-[140px] w-full items-start gap-6 p-6">
            <Link href={`/profile/${user.id}`}>
              <Avatar className="mx-auto shrink-0" size="lg">
                <AvatarImage src={user.image || "/img/avatar.jpg"} />
                <AvatarFallback>
                  {getInitials({
                    name: user.name,
                    email: user.email,
                  })}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="min-w-0 truncate text-sm font-medium text-gray-900">
                  {user.name}
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center underline"
                >
                  <span className="truncate">{user.email}</span>
                  <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0" />
                </a>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {user.phone ? (
                  <a
                    href={`tel:${user.phone}`}
                    className="flex items-center underline"
                  >
                    <span className="truncate">{user.phone}</span>
                    <ExternalLinkIcon className="ml-1 h-4 w-4 shrink-0" />
                  </a>
                ) : null}
              </p>
              <p className="mt-1 truncate text-sm text-gray-500">
                {[user.address, user.city, user.city].some(Boolean)
                  ? formatAddress(user)
                  : null}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
