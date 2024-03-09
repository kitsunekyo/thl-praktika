"use server";

import {
  sendNotification as sendWebPushNotification,
  setVapidDetails,
} from "web-push";

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

export async function sendNotification(
  subscription: any,
  payload: { title: string; message: string },
) {
  console.log(subscription);
  return sendWebPushNotification(subscription, JSON.stringify(payload));
}
