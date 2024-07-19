import { Registration, Training } from "@prisma/client";

import { PublicUser } from "@/lib/prisma";

export interface WithAuthor {
  author: PublicUser;
}

export interface WithUser {
  user: PublicUser;
}

interface RegistrationWithUser extends Registration, WithUser {}

export interface WithRegistrations {
  registrations: RegistrationWithUser[];
}
