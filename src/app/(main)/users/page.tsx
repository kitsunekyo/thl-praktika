import { ExternalLinkIcon, MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

import { PageTitle } from "@/components/PageTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getServerSession } from "@/modules/auth/getServerSession";
import { formatAddress } from "@/modules/users/address";
import { getInitials } from "@/modules/users/name";
import { getUserProfiles } from "@/modules/users/queries";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const users = await getUserProfiles();

  return (
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
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {users.map((user) => (
        <li
          key={user.email}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
        >
          <div className="flex w-full items-start justify-between space-x-6 p-6">
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
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">
                  {user.name}
                </h3>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">
                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center underline"
                >
                  {user.email}
                  <ExternalLinkIcon className="ml-1 h-4 w-4" />
                </a>
              </p>
              <p className="mt-1 truncate text-sm text-gray-500">
                {user.phone ? (
                  <a
                    href={`tel:${user.phone}`}
                    className="inline-flex items-center underline"
                  >
                    {user.phone}
                    <ExternalLinkIcon className="ml-1 h-4 w-4" />
                  </a>
                ) : (
                  "-"
                )}
              </p>
              <p className="mt-1 truncate text-sm text-gray-500">
                {[user.address, user.city, user.city].some(Boolean)
                  ? formatAddress(user)
                  : "-"}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
