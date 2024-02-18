import Image from "next/image";

import { formatAddress } from "@/modules/users/address";
import { getProfileById } from "@/modules/users/queries";

export default async function Profile({
  params: { id },
}: {
  params: { id: string };
}) {
  const profile = await getProfileById(id);

  const role = profile.role === "trainer" ? "Trainer" : "Praktikant";

  return (
    <div className="max-w-[600px] py-6">
      <div className="mb-6 space-y-4">
        <ProfileImage src={profile.image} />
        <div>
          <h1 className="font-medium">{profile.name}</h1>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                E-Mail
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {profile.email}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Telefonnummer
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {profile.phone ? (
                  profile.phone
                ) : (
                  <span className="italic text-muted-foreground">
                    noch nicht ausgefüllt
                  </span>
                )}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Adresse
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {profile.address || profile.city || profile.zipCode ? (
                  formatAddress({
                    address: profile.address,
                    city: profile.city,
                    zipCode: profile.zipCode,
                  })
                ) : (
                  <span className="italic text-muted-foreground">
                    noch nicht ausgefüllt
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function ProfileImage({ src }: { src: string | null }) {
  return (
    <div className="relative h-[140px] w-[140px]">
      <Image
        fill
        priority
        src={src || "/img/avatar.jpg"}
        alt="Profilbild"
        sizes="140px"
        className="overflow-hidden rounded-full object-cover"
      />
    </div>
  );
}
