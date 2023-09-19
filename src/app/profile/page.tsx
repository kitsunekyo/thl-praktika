import Image from "next/image";
import { redirect } from "next/navigation";

import { getMe } from "./actions";
import { ProfileForm } from "./ProfileForm";

export default async function Profile() {
  const user = await getMe();

  if (!user) {
    redirect("/");
  }

  return (
    <div>
      <h1 className="mb-8 text-xl font-semibold">Dein Profil</h1>
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
