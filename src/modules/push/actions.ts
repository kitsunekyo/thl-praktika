"use server";

import {
  sendNotification as sendWebPushNotification,
  setVapidDetails,
} from "web-push";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { subscriptionSchema } from "./schema";
import { auth } from "../auth/next-auth";

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
  subscriptionJSON: PushSubscriptionJSON,
  payload: { title: string; message: string },
) {
  const subscription = subscriptionSchema.parse(subscriptionJSON);
  return sendWebPushNotification(subscription, JSON.stringify(payload));
}

export async function saveSubscription(subscriptionJSON: PushSubscriptionJSON) {
  const session = await auth();
  const currentUser = session?.user;
  if (!currentUser) {
    throw new Error("not authorized");
  }
  const subscription = subscriptionSchema.parse(subscriptionJSON);
  console.log("subscription on server", subscription);

  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      endpoint: subscription.endpoint,
    },
  });

  if (existingSubscription) {
    throw new Error("subscription already exists");
  }

  await prisma.subscription.create({
    data: {
      userId: currentUser.id,
      ...subscription,
    },
  });
}
