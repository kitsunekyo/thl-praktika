import { ServerClient } from "postmark";

const client = new ServerClient(process.env.POSTMARK_API_TOKEN || "");

export function sendInvitationMail({ to, name }: { to: string; name: string }) {
  const templateId =
    process.env.NODE_ENV === "development" ? 33246448 : 33246306;

  client.sendEmailWithTemplate({
    From: "hi@mostviertel.tech",
    To: to,
    TemplateId: templateId,
    MessageStream: "outbound",
    TemplateModel: {
      product_url: "https://thl-praktika.vercel.app",
      name: name,
      invite_sender_name: "Alex",
      action_url: `https://thl-praktika.vercel.app/signup?email=${to}&name=${name}`,
    },
  });
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

  client.sendEmailWithTemplate({
    From: "hi@mostviertel.tech",
    To: to,
    TemplateId: templateId,
    MessageStream: "outbound",
    TemplateModel: {
      product_url: "https://thl-praktika.vercel.app",
      action_url: `https://thl-praktika.vercel.app/reset-password?t=${tokenId}&v=${tokenValue}`,
    },
  });
}
