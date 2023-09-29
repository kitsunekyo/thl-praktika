import { ServerClient } from "postmark";

const client = new ServerClient(process.env.POSTMARK_API_TOKEN || "");

export function sendInvitationMail({ to, name }: { to: string; name: string }) {
  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateAlias: "user-invitation",
    MessageStream: "outbound",
    TemplateModel: {
      product_url: process.env.NEXTAUTH_URL,
      name: name,
      invite_sender_name: "Alex",
      action_url: `${process.env.NEXTAUTH_URL}/signup?email=${to}&name=${name}`,
    },
  };

  client.sendEmailWithTemplate(payload);
  console.log("invitation mail sent", payload);
}

export function sendForgotPasswordMail({
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

  client.sendEmailWithTemplate(payload);
  console.log("forgot password mail sent", payload);
}

export function sendTrainingCancelledMail({
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

  client.sendEmailWithTemplate(payload);
  console.log("training cancelled mail sent", payload);
}
