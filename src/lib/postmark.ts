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
  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateAlias:
      role === "trainer" ? "trainer-invitation" : "user-invitation",
    MessageStream: "outbound",
    TemplateModel: {
      product_url: process.env.NEXTAUTH_URL,
      name: name,
      invite_sender_name: "Alex",
      action_url: `${process.env.NEXTAUTH_URL}/signup?email=${to}&name=${name}&id=${id}`,
    },
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

export async function sendTrainingRegistrationNotificationMail({
  to,
  trainerName,
}: {
  to: string;
  trainerName: string;
}) {
  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateAlias: "training-registration-notification",
    MessageStream: "outbound",
    TemplateModel: {
      trainer_name: trainerName,
      product_url: process.env.NEXTAUTH_URL,
    },
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

export async function sendTrainingRequestReceivedMail({
  to,
  userName,
}: {
  to: string;
  userName: string;
}) {
  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateAlias: "training-request-received",
    MessageStream: "outbound",
    TemplateModel: {
      product_url: process.env.NEXTAUTH_URL,
      user_name: userName,
    },
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

export async function sendForgotPasswordMail({
  to,
  tokenId,
  tokenValue,
}: {
  to: string;
  tokenId: string;
  tokenValue: string;
}) {
  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateAlias: "forgot-password",
    MessageStream: "outbound",
    TemplateModel: {
      product_url: process.env.NEXTAUTH_URL,
      action_url: `${process.env.NEXTAUTH_URL}/reset-password?t=${tokenId}&v=${tokenValue}`,
    },
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

export async function sendTrainingCancelledMail({
  to,
  trainer,
  date,
}: {
  to: string;
  trainer: string;
  date: string;
}) {
  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateAlias: "training-cancelled",
    MessageStream: "outbound",
    TemplateModel: {
      trainer,
      date,
      product_url: process.env.NEXTAUTH_URL,
      action_url: process.env.NEXTAUTH_URL,
    },
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
  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateAlias: "registration-cancelled",
    MessageStream: "outbound",
    TemplateModel: {
      product_url: process.env.NEXTAUTH_URL,
      user,
      name: trainerName,
      date,
      action_url: process.env.NEXTAUTH_URL,
    },
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
  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateAlias: "training-updated",
    MessageStream: "outbound",
    TemplateModel: {
      trainer_name: trainerName,
      date: formatTrainingDate(training.start, training.end),
      description: training.description || "",
      address: formatAddress(training),
      product_url: process.env.NEXTAUTH_URL,
      action_url: process.env.NEXTAUTH_URL,
    },
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
