"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { sendNotification } from "@/modules/push/actions";

function useNotificationPermissions() {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setPermission(window.Notification.permission);
  }, []);

  async function requestPermission() {
    if (typeof window === "undefined") {
      return;
    }
    const requestResult = await window.Notification.requestPermission();
    setPermission(requestResult);
    window.navigator.serviceWorker.ready.then((reg) => {
      reg.active?.postMessage("permission_granted");
    });
  }

  return { value: permission, request: requestPermission };
}

export function NotificationTest() {
  const permission = useNotificationPermissions();

  async function push() {
    const registration = await window.navigator.serviceWorker.getRegistration();
    if (!registration) {
      return;
    }
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      return;
    }

    await sendNotification(subscription.toJSON(), {
      title: "Test Notification",
      message: "This is a test notification",
    });
  }

  return (
    <>
      <h1 className="text-lg font-medium">Push Notifications Test</h1>
      <div className="flex flex-col gap-2">
        <div>Permission {permission.value}</div>
        {permission.value === "default" && (
          <Button onClick={permission.request}>Enable Notifications</Button>
        )}
        <Button onClick={push}>Send Notification</Button>
      </div>
    </>
  );
}
