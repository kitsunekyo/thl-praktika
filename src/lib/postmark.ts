import { ServerClient } from "postmark";

const client = new ServerClient(process.env.POSTMARK_API_TOKEN || "");

export function sendInvitationMail({ to, name }: { to: string; name: string }) {
  const templateId =
    process.env.NODE_ENV === "development" ? 33246448 : 33246306;

  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateId: templateId,
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
  const templateId =
    process.env.NODE_ENV === "development" ? 33276953 : 33277711;

  const payload = {
    From: "hi@mostviertel.tech",
    To: to,
    TemplateId: templateId,
    MessageStream: "outbound",
    TemplateModel: {
      product_url: process.env.NEXTAUTH_URL,
      action_url: `${process.env.NEXTAUTH_URL}/reset-password?t=${tokenId}&v=${tokenValue}`,
    },
  };

  client.sendEmailWithTemplate(payload);
  console.log("forgot password mail sent", payload);
}
