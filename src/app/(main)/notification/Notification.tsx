"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { saveSubscription, sendNotification } from "@/modules/push/actions";
import { subscriptionSchema } from "@/modules/push/schema";

/**
 * TODO:
 * when the user first denies the permission and later grants it via the browser settings
 * the onGranted callback is not called. the useEffect does not run, even if the page is soft reloaded via the browser prompt
 * this might be due to SSR prerendering on client components.
 */

function useNotificationPermissions({
  onGranted,
  onDenied,
}: { onGranted?: () => void; onDenied?: () => void } = {}) {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const value = window.Notification.permission;
    setPermission(value);
  }, [permission]);

  async function requestPermission() {
    if (typeof window === "undefined") {
      return;
    }
    const requestResult = await window.Notification.requestPermission();
    setPermission(requestResult);
    if (requestResult === "granted" && onGranted) {
      onGranted();
      return;
    }
    if (requestResult === "denied" && onDenied) {
      onDenied();
      return;
    }
  }

  return { value: permission, request: requestPermission };
}

export function NotificationTest({
  subscription,
}: {
  subscription: z.infer<typeof subscriptionSchema> | null;
}) {
  const [pending, startTransition] = useTransition();
  const notificationPermission = useNotificationPermissions();

  async function push() {
    const registration = await window.navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      return;
    }

    await sendNotification(subscription.toJSON(), {
      title: "Test Notification",
      message: "This is a test notification",
    });
  }

  async function subscribe() {
    const registration = await window.navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      userVisibleOnly: true, // required in chrome, to prevent sending without the user knowing
    });
    startTransition(async () => {
      await saveSubscription(subscription.toJSON());
    });
  }

  return (
    <>
      <h1 className="text-lg font-medium">Push Notifications Test</h1>
      <div className="flex flex-col gap-2">
        <div>Permission {notificationPermission.value}</div>

        <Button
          onClick={notificationPermission.request}
          disabled={notificationPermission.value !== "default"}
        >
          Enable Notifications
          {notificationPermission.value === "granted"
            ? " (granted)"
            : "(denied)"}
        </Button>
        <Button
          onClick={subscribe}
          disabled={
            notificationPermission.value !== "granted" || !!subscription
          }
        >
          Subscribe to Changes {subscription ? "(subscribed)" : null}
        </Button>
        <Button onClick={push}>Send Notification</Button>
      </div>
    </>
  );
}
