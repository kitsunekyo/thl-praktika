import { Training } from "@prisma/client";
import { captureException } from "@sentry/nextjs";
import { ServerClient } from "postmark";

import { formatTrainingDate } from "./date";
import { formatAddress } from "./user";

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
    action_url: `${process.env.NEXTAUTH_URL}/signup?email=${to}&name=${name}&id=${id}`,
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
}: {
  to: string;
  userName: string;
}) {
  await sendMail(to, "training-request-received", {
    product_url: process.env.NEXTAUTH_URL,
    user_name: userName,
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
}: {
  to: string;
  trainer: string;
  date: string;
}) {
  await sendMail(to, "training-cancelled", {
    trainer,
    date,
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
  training: Pick<
    Training,
    "description" | "start" | "end" | "address" | "city" | "zipCode"
  >;
}) {
  await sendMail(to, "training-updated", {
    trainer_name: trainerName,
    date: formatTrainingDate(training.start, training.end),
    description: training.description || "",
    address: formatAddress(training),
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
  await sendMail(to, "training-cancelled", {
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
