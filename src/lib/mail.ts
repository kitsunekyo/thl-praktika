import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { captureException } from "@sentry/nextjs";

import { preferencesSchema } from "@/modules/users/preferences";

import { prisma } from "./prisma";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const SENDER_EMAIL = "hi@mostviertel.tech";

type MailData = {
  templateName: string;
  to: string;
  replyTo?: string;
  data: unknown;
};

interface TrainingCancelled extends MailData {
  templateName: "training-cancelled";
  data: {
    trainer_name: string;
    date: string;
    reason: string;
  };
}

interface TrainingUpdated extends MailData {
  templateName: "training-updated";
  data: {
    trainer_name: string;
    date: string;
    description: string;
    address: string;
  };
}

interface TrainingRequest extends MailData {
  templateName: "training-request";
  data: {
    user_name: string;
    user_email: string;
    user_phone: string | null;
    message?: string;
  };
}

interface TrainingRegistrationCancelled extends MailData {
  templateName: "training-registration-cancelled";
  data: {
    user_name: string;
    date: string;
  };
}

interface TrainingRegistration extends MailData {
  templateName: "training-registration";
  data: {
    user_name: string;
    date: string;
  };
}

interface Invitation extends MailData {
  templateName: "user-invitation" | "trainer-invitation";
  data: {
    invite_sender_name: string;
    action_url: string;
  };
}

interface ForgotPassword extends MailData {
  templateName: "forgot-password";
  data: {
    action_url: string;
  };
}

interface TrainingCreated extends MailData {
  templateName: "training-created";
  data: {
    trainer_name: string;
  };
}

type EmailOptions =
  | TrainingCreated
  | TrainingUpdated
  | TrainingRequest
  | TrainingRegistration
  | TrainingRegistrationCancelled
  | TrainingCancelled
  | Invitation
  | ForgotPassword;

const TEMPLATE_ID_MAP: Record<EmailOptions["templateName"], string> = {
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

export async function sendMail(config: EmailOptions) {
  const isDisabled = await getIsSendingDisabled(config.to, config.templateName);
  if (isDisabled) {
    return;
  }

  const sendgridMailData = {
    from: { name: "Alex", email: SENDER_EMAIL },
    to: config.to,
    replyTo: config.replyTo || SENDER_EMAIL,
    templateId: TEMPLATE_ID_MAP[config.templateName],
    dynamicTemplateData: config.data,
  } satisfies MailDataRequired;

  if (process.env.NODE_ENV === "development") {
    console.log("mock: mail sent", sendgridMailData);
    return;
  }

  return sgMail.send(sendgridMailData).catch((e) => {
    captureException(e);
    console.log(e);
    throw new Error("could not send email");
  });
}

const TEMPLATE_PREF_MAP = {
  "training-registration": "trainingRegistration",
  "training-registration-cancelled": "trainingRegistrationCancelled",
  "training-created": "trainingCreatedAfterRegistration",
} as const;

function canBeDisabled(
  template: EmailOptions["templateName"],
): template is keyof typeof TEMPLATE_PREF_MAP {
  const templatesWithPreferences = Object.keys(TEMPLATE_PREF_MAP);
  return templatesWithPreferences.includes(template);
}

async function getIsSendingDisabled(
  to: string,
  templateName: EmailOptions["templateName"],
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

  return emailPreferences[TEMPLATE_PREF_MAP[templateName]] === false;
}
