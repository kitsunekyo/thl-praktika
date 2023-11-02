import { ServerClient } from "postmark";

const client = new ServerClient(process.env.POSTMARK_API_TOKEN || "");

export async function sendInvitationMail({
  to,
  name,
  role = "user",
}: {
  to: string;
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
      action_url: `${process.env.NEXTAUTH_URL}/signup?email=${to}&name=${name}`,
    },
  };
  if (process.env.NODE_ENV === "production") {
    await client.sendEmailWithTemplate(payload);
    return;
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
      product_url: process.env.NEXTAUTH_URL,
      trainer_name: trainerName,
    },
  };
  if (process.env.NODE_ENV === "production") {
    await client.sendEmailWithTemplate(payload);
    return;
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
    await client.sendEmailWithTemplate(payload);
    return;
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
    await client.sendEmailWithTemplate(payload);
    return;
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
      product_url: process.env.NEXTAUTH_URL,
      trainer,
      date,
      action_url: process.env.NEXTAUTH_URL,
    },
  };
  if (process.env.NODE_ENV === "production") {
    await client.sendEmailWithTemplate(payload);
    return;
  }

  console.log("mock: mail sent", payload);
}
