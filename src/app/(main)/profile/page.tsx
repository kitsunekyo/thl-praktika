import Image from "next/image";

import { PageTitle } from "@/components/PageTitle";

import { getMe } from "./actions";
import { ProfileForm } from "./ProfileForm";

export default async function Profile() {
  const user = await getMe();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[600px]">
      <PageTitle>Dein Profil</PageTitle>
      <Image
        width={120}
        height={120}
        src={user.image || "/img/avatar.jpg"}
        alt="Avatar"
        className="mb-4 rounded-full"
      />
      <ProfileForm user={user} />
    </div>
  );
}
