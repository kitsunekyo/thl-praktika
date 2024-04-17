import { Training } from "@prisma/client";
import { captureException } from "@sentry/nextjs";
import { ServerClient } from "postmark";

import { formatTrainingDate } from "./date";
import { prisma } from "./prisma";
import { preferencesSchema } from "../modules/users/preferences";

const client = new ServerClient(process.env.POSTMARK_API_TOKEN || "");

export async function sendInvitationMail({
  to,
  name,
  id,
  role = "user",
}: {
  to: string;
  id: string;
  name: string;
  role?: "user" | "trainer" | "admin";
}) {
  const template =
    role === "trainer" ? "trainer-invitation" : "user-invitation";
  await sendMail(to, template, {
    product_url: process.env.NEXTAUTH_URL,
    name,
    invite_sender_name: "Alex",
    action_url: `${process.env.NEXTAUTH_URL}/signup?email=${to}&name=${encodeURIComponent(name)}&id=${id}`,
  });
}

export async function sendTrainingRegistrationNotificationMail({
  to,
  trainerName,
}: {
  to: string;
  trainerName: string;
}) {
  await sendMail(to, "training-registration-notification", {
    trainer_name: trainerName,
    product_url: process.env.NEXTAUTH_URL,
  });
}

export async function sendTrainingRequestReceivedMail({
  to,
  userName,
  message,
}: {
  to: string;
  userName: string;
  message?: string;
}) {
  await sendMail(to, "training-request-received", {
    product_url: process.env.NEXTAUTH_URL,
    user_name: userName,
    message,
  });
}

export async function sendForgotPasswordMail({
  to,
  tokenId,
  tokenValue,
}: {
  to: string;
  tokenId: string;
  tokenValue: string;
}) {
  await sendMail(to, "forgot-password", {
    product_url: process.env.NEXTAUTH_URL,
    action_url: `${process.env.NEXTAUTH_URL}/reset-password?t=${tokenId}&v=${tokenValue}`,
  });
}

export async function sendTrainingCancelledMail({
  to,
  trainer,
  date,
  reason,
}: {
  to: string;
  trainer: string;
  date: string;
  reason: string;
}) {
  await sendMail(to, "training-cancelled", {
    trainer,
    date,
    reason,
    product_url: process.env.NEXTAUTH_URL,
    action_url: process.env.NEXTAUTH_URL,
  });
}

export async function sendRegistrationCancelledMail({
  to,
  user,
  trainerName,
  date,
}: {
  to: string;
  trainerName: string;
  user: string;
  date: string;
}) {
  await sendMail(to, "registration-cancelled", {
    product_url: process.env.NEXTAUTH_URL,
    user,
    name: trainerName,
    date,
    action_url: process.env.NEXTAUTH_URL,
  });
}

export async function sendTrainingUpdatedMail({
  to,
  trainerName,
  training,
}: {
  to: string;
  trainerName: string;
  training: Pick<Training, "description" | "start" | "end" | "address">;
}) {
  await sendMail(to, "training-updated", {
    trainer_name: trainerName,
    date: formatTrainingDate(training.start, training.end),
    description: training.description || "",
    address: training.address,
    product_url: process.env.NEXTAUTH_URL,
    action_url: process.env.NEXTAUTH_URL,
  });
}

export async function sendTrainingRegistrationMail({
  to,
  trainerName,
  userName,
  date,
}: {
  to: string;
  trainerName: string;
  userName: string;
  date: string;
}) {
  await sendMail(to, "training-registration", {
    name: trainerName,
    user: userName,
    date,
    product_url: process.env.NEXTAUTH_URL,
    action_url: process.env.NEXTAUTH_URL,
  });
}

async function sendMail(
  to: string,
  templateAlias: string,
  templateModel?: any,
) {
  const isDisabled = await checkIsSendingDisabled(to, templateAlias);

  if (isDisabled) {
    return;
  }

  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateAlias: templateAlias,
    MessageStream: "outbound",
    TemplateModel: templateModel,
  };
  if (process.env.NODE_ENV === "production") {
    try {
      await client.sendEmailWithTemplate(payload);
      return;
    } catch (e) {
      captureException(e);
    }
  }
  console.log("mock: mail sent", payload);
}

// TODO: this fucking ugly. use a map
async function checkIsSendingDisabled(to: string, templateAlias: string) {
  const recipientUser = await prisma.user.findFirst({
    where: {
      email: to,
    },
    select: {
      id: true,
      email: true,
      preferences: true,
    },
  });

  if (!recipientUser) {
    return false;
  }

  const emailPreferences = preferencesSchema.parse(
    recipientUser.preferences || {},
  ).email;

  // TODO: fix type error for index signature and use map

  if (
    !emailPreferences.trainingCreatedAfterRegistration &&
    templateAlias === "training-registration-notification"
  ) {
    console.log(
      "user does not want to receive trainingCreatedAfterRegistration email",
    );
    return true;
  }
  if (
    !emailPreferences.trainingRegistration &&
    templateAlias === "training-registration"
  ) {
    console.log("user does not want to receive trainingRegistration email");
    return true;
  }
  if (
    !emailPreferences.trainingRegistrationCancelled &&
    templateAlias === "registration-cancelled"
  ) {
    console.log(
      "user does not want to receive trainingRegistrationCancelled email",
    );
    return true;
  }

  return false;
}
