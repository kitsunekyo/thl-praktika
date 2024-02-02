import Image from "next/image";

import { AvatarUpload } from "@/components/AvatarUpload";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { PreferencesForm } from "@/components/PreferencesForm";
import { ProfileForm } from "@/components/ProfileForm";
import { preferencesSchema } from "@/lib/preferences";

import { getProfile } from "./actions";

export default async function Profile() {
  const user = await getProfile();
  const preferences = preferencesSchema.parse(user.preferences);

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
          <h2 className="text-base font-semibold leading-7">Einstellungen</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Einstellungen um dein Konto anzupassen.
          </p>
        </div>

        <div className="md:col-span-2">
          <PreferencesForm preferences={preferences} role={user.role} />
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
