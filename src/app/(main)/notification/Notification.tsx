"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

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

    await fetch("/api/notification", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription,
      }),
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

const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
