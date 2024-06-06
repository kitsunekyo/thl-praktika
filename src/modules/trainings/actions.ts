"use server";

import { revalidatePath } from "next/cache";

import { formatTrainingDate } from "@/lib/date";
import { AuthorizationError } from "@/lib/errors";
import { sendMail } from "@/lib/mail";
import { prisma, selectPublicUser } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/next-auth";

export async function register(id: string) {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new AuthorizationError();
  }

  const training = await prisma.training.findFirst({
    where: {
      id: id,
    },
    include: {
      registrations: true,
      author: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!training) {
    revalidatePath("/trainings");
    throw new Error("training not found");
  }

  const isRegisteredAlready = training.registrations
    .map((r) => r.userId)
    .includes(currentUser.id);

  if (isRegisteredAlready) {
    revalidatePath("/trainings");
    throw new Error("already registered");
  }

  const isMaximumCapacity =
    training.registrations.length >= training.maxInterns;

  if (isMaximumCapacity) {
    revalidatePath("/trainings");
    throw new Error("maximum capacity reached");
  }

  await prisma.registration.create({
    data: {
      trainingId: id,
      userId: currentUser.id,
    },
  });

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: currentUser.id,
    },
    select: selectPublicUser,
  });

  sendMail({
    to: training.author.email,
    templateName: "training-registration",
    data: {
      user_name: user.name,
      user_email: user.email,
      user_phone: user.phone,
      date: formatTrainingDate(training.start, training.end),
    },
  });

  revalidatePath("/trainings");
}

export async function unregister(id: string) {
  const session = await getServerSession();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new AuthorizationError();
  }

  const registration = await prisma.registration.findFirst({
    where: {
      trainingId: id,
      userId: currentUser.id,
    },
    include: {
      training: {
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!registration) {
    throw new Error("registration not found");
  }

  await prisma.registration.delete({
    where: {
      id: registration.id,
    },
  });

  sendMail({
    to: registration.training.author.email,
    templateName: "training-registration-cancelled",
    data: {
      user_name: currentUser.name,
      date: formatTrainingDate(
        registration.training.start,
        registration.training.end,
      ),
    },
  });

  revalidatePath("/");
}
export async function deleteRegistration(id: string) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new AuthorizationError();
  }
  await prisma.registration.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/registrations");
}
