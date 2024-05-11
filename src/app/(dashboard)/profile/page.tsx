import Image from "next/image";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumbs";
import { AuthorizationError } from "@/lib/errors";
import { ChangePasswordForm } from "@/modules/auth/components/ChangePasswordForm";
import { AvatarUpload } from "@/modules/users/components/AvatarUpload";
import { DeleteAccount } from "@/modules/users/components/DeleteAccount";
import { PreferencesForm } from "@/modules/users/components/PreferencesForm";
import { ProfileForm } from "@/modules/users/components/ProfileForm";
import { preferencesSchema } from "@/modules/users/preferences";
import { getMyProfile } from "@/modules/users/queries";

export default async function Profile() {
  const user = await getMyProfile();
  if (!user) {
    throw new AuthorizationError();
  }
  const preferences = preferencesSchema.parse(user.preferences || {}); // value can be DB null, or "null" as json value, so we need to supply a default value

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbsItem href="/profile">Profil</BreadcrumbsItem>
      </Breadcrumbs>
      <article className="divide-y">
        <section className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-16 md:grid-cols-3">
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
        </section>

        <section className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-16 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7">Einstellungen</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Einstellungen um dein Konto anzupassen.
            </p>
          </div>

          <div className="md:col-span-2">
            <PreferencesForm preferences={preferences} role={user.role} />
          </div>
        </section>

        <section className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-16 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7">
              Passwort ändern
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Ändere das Passwort für dein Konto.
            </p>
          </div>

          <div className="md:col-span-2">
            <ChangePasswordForm />
          </div>
        </section>

        <section className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-16 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7">Konto löschen</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Möchtest du unseren Service nicht mehr nutzen? Du kannst dein
              Konto hier löschen. Diese Aktion ist nicht rückgängig zu machen.
              Alle Informationen, die mit diesem Konto verbunden sind, werden
              dauerhaft gelöscht.
            </p>
          </div>

          <div className="flex items-start md:col-span-2">
            <DeleteAccount />
          </div>
        </section>
      </article>
    </>
  );
}
