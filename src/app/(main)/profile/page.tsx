import Image from "next/image";

import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { Button } from "@/components/ui/button";

import { getProfile } from "./actions";
import { AvatarUpload } from "./AvatarUpload";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { ProfileForm } from "./ProfileForm";

export default async function Profile() {
  const user = await getProfile();

  if (!user) {
    return null;
  }

  return (
    <div className="divide-y divide-white/5">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7">
            Persönliche Informationen
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Vervollständige dein Profil mit persönlichen Informationen, damit
            dich andere kontaktieren können.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="mb-6 flex gap-4 space-y-4">
            <div className="relative h-[80px] w-[80px]">
              <Image
                fill
                priority
                src={user.image || "/img/avatar.jpg"}
                alt="Profilbild"
                sizes="140px"
                className="overflow-hidden rounded-full object-cover"
              />
            </div>
            <AvatarUpload />
          </div>
          <ProfileForm user={user} />
        </div>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7">Passwort ändern</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Ändere das Passwort für dein Konto.
          </p>
        </div>

        <div className="md:col-span-2">
          <ChangePasswordForm />
        </div>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7">Konto löschen</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Möchtest du unseren Service nicht mehr nutzen? Du kannst dein Konto
            hier löschen. Diese Aktion ist nicht rückgängig zu machen. Alle
            Informationen, die mit diesem Konto verbunden sind, werden dauerhaft
            gelöscht.
          </p>
        </div>

        <div className="flex items-start md:col-span-2">
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
