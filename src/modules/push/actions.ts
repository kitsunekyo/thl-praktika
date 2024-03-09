"use server";

import {
  sendNotification as sendWebPushNotification,
  setVapidDetails,
} from "web-push";
import { z } from "zod";

if (
  !process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
  !process.env.WEB_PUSH_PRIVATE_KEY ||
  !process.env.WEB_PUSH_EMAIL
) {
  throw new Error(
    "NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY, and WEB_PUSH_EMAIL must be set in env",
  );
}

setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY,
);

const subscriptionSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});

export async function sendNotification(
  subscriptionJSON: PushSubscriptionJSON,
  payload: { title: string; message: string },
) {
  const subscription = subscriptionSchema.parse(subscriptionJSON);
  return sendWebPushNotification(subscription, JSON.stringify(payload));
}
