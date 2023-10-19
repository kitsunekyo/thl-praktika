import Image from "next/image";

import { PageTitle } from "@/components/PageTitle";

import { getProfile } from "./actions";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { ProfileForm } from "./ProfileForm";

export default async function Profile() {
  const user = await getProfile();

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-[600px] py-6">
      <Image
        width={120}
        height={120}
        priority
        src={user.image || "/img/avatar.jpg"}
        alt="Avatar"
        className="mb-4 rounded-full"
      />
      <ProfileForm user={user} />
      <hr className="my-8" />
      <ChangePasswordForm />
    </div>
  );
}
