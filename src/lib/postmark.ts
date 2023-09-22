import { ServerClient } from "postmark";

export const client = new ServerClient(process.env.POSTMARK_API_TOKEN || "");

export function sendEmail({
  subject,
  body,
  to,
}: {
  subject: string;
  body: string;
  to: string;
}) {
  client.sendEmail({
    From: "hi@mostviertel.tech",
    To: to,
    Subject: subject,
    TextBody: body,
  });
}

export function sendInvitationMail({ to, name }: { to: string; name: string }) {
  client.sendEmailWithTemplate({
    From: "hi@mostviertel.tech",
    To: to,
    TemplateId: 33246448,
    MessageStream: "outbound",
    TemplateModel: {
      product_url: "https://thl-praktika.vercel.app",
      name: name,
      invite_sender_name: "Alex",
      action_url: `https://thl-praktika.vercel.app/signup?email=${to}&name=${name}`,
    },
  });
}
