import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { captureException } from "@sentry/nextjs";

import { preferencesSchema } from "@/modules/users/preferences";

import { prisma } from "./prisma";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const SENDER_EMAIL = "hi@mostviertel.tech";

interface MailOptions {
  to: string;
  replyTo?: string;
}

interface TemplateMailData extends MailOptions {
  templateName: string;
  data: unknown;
}

interface TrainingCancelled extends TemplateMailData {
  templateName: "training-cancelled";
  data: {
    trainer_name: string;
    date: string;
    reason: string;
  };
}

interface TrainingUpdated extends TemplateMailData {
  templateName: "training-updated";
  data: {
    trainer_name: string;
    date: string;
    description: string;
    address: string;
  };
}

interface TrainingRequest extends TemplateMailData {
  templateName: "training-request";
  data: {
    user_name: string;
    user_email: string;
    user_phone: string | null;
    message?: string;
  };
}

interface TrainingRegistrationCancelled extends TemplateMailData {
  templateName: "training-registration-cancelled";
  data: {
    user_name: string;
    date: string;
  };
}

interface TrainingRegistration extends TemplateMailData {
  templateName: "training-registration";
  data: {
    user_name: string;
    date: string;
    user_email: string;
    user_phone: string | null;
  };
}

interface Invitation extends TemplateMailData {
  templateName: "user-invitation" | "trainer-invitation";
  data: {
    invite_sender_name: string;
    action_url: string;
  };
}

interface ForgotPassword extends TemplateMailData {
  templateName: "forgot-password";
  data: {
    action_url: string;
  };
}

interface TrainingCreated extends TemplateMailData {
  templateName: "training-created";
  data: {
    trainer_name: string;
  };
}

type TemplateMailOptions =
  | TrainingCreated
  | TrainingUpdated
  | TrainingRequest
  | TrainingRegistration
  | TrainingRegistrationCancelled
  | TrainingCancelled
  | Invitation
  | ForgotPassword;

const TEMPLATE_ID_MAP: Record<TemplateMailOptions["templateName"], string> = {
  "training-cancelled": "d-745ee4a501d946c0a7b6636ea5ad77cc",
  "training-updated": "d-b3801af82a314193a1e6d89d1cb34898",
  "training-request": "d-c7e4253108604ce484d897c72ba36e7b",
  "training-registration-cancelled": "d-4834e144ae114cd598727482a6dc1152",
  "training-registration": "d-074a89040eda4f6bb7f01d23db2daab8",
  "user-invitation": "d-ac74ca3315994a09b2c5adee0c46b396",
  "trainer-invitation": "d-04bf878ce65341369eaacca65a6f4eb6",
  "forgot-password": "d-ab83dedb48b542048ef4acfa1997d0a8",
  "training-created": "d-6e42350a3566463e809af95b64d7b3ee",
} as const;

export async function sendTemplateMail(options: TemplateMailOptions) {
  const isDisabled = await getIsSendingDisabled(
    options.to,
    options.templateName,
  );
  if (isDisabled) {
    return;
  }

  const sendgridMailData = {
    from: { name: "THL Praktika", email: SENDER_EMAIL },
    to: options.to,
    replyTo: options.replyTo || SENDER_EMAIL,
    templateId: TEMPLATE_ID_MAP[options.templateName],
    dynamicTemplateData: options.data,
  } satisfies MailDataRequired;

  if (process.env.NODE_ENV === "development") {
    console.log("mock template email sent", sendgridMailData);
    return;
  }

  return sgMail.send(sendgridMailData).catch((e) => {
    captureException(e);
    console.log(e);
    throw new Error("could not send email");
  });
}

interface HtmlMailOptions extends MailOptions {
  subject: string;
  html: string;
}

export async function sendHtmlMail({ to, subject, html }: HtmlMailOptions) {
  if (process.env.NODE_ENV === "development") {
    console.log("mock html email sent", { html, to });
    return;
  }

  return sgMail
    .send({
      from: { name: "THL Praktika", email: SENDER_EMAIL },
      to,
      html,
      subject,
    })
    .catch((e) => {
      captureException(e);
      throw new Error("could not send email");
    });
}

const TEMPLATE_PREFERENCE_MAP = {
  "training-registration": "trainingRegistration",
  "training-registration-cancelled": "trainingRegistrationCancelled",
  "training-created": "trainingCreatedAfterRegistration",
} as const;

function canBeDisabled(
  template: TemplateMailOptions["templateName"],
): template is keyof typeof TEMPLATE_PREFERENCE_MAP {
  const templatesWithPreferences = Object.keys(TEMPLATE_PREFERENCE_MAP);
  return templatesWithPreferences.includes(template);
}

async function getIsSendingDisabled(
  to: string,
  templateName: TemplateMailOptions["templateName"],
) {
  if (!canBeDisabled(templateName)) {
    return false;
  }

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

  return emailPreferences[TEMPLATE_PREFERENCE_MAP[templateName]] === false;
}
