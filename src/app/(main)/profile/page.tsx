import Image from "next/image";

import { getProfile } from "./actions";
import { AvatarUpload } from "./AvatarUpload";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function Profile() {
  const user = await getProfile();

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-[600px] py-6">
      <div className="mb-6 space-y-4">
        <div className="relative h-[140px] w-[140px]">
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
      <hr className="my-8" />
      <ChangePasswordForm />
    </div>
  );
}
