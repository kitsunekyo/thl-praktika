import { defaultCache } from "@serwist/next/browser";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  // Change this attribute's name to your `injectionPoint`.
  // `injectionPoint` is an InjectManifest option.
  // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

// self.addEventListener("message", async (event) => {
//   if (event.data === "permission_granted") {
//     console.log("sw:permission_granted");
//     await subscribe();
//   }
// });

self.addEventListener("push", async (event) => {
  console.log("sw:push");
  if (!event.data) {
    return;
  }
  const data = await event.data.json();
  self.registration.showNotification("Hello from THL Praktika", {
    body: "Es gibt ein neues Praktikum!",
  });
});

self.addEventListener("activate", async (e) => {
  console.log("sw:activated");
  await subscribe();
});

async function subscribe() {
  return;

  if (
    !process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
    Notification.permission !== "granted"
  ) {
    return;
  }
  try {
    const subscription = await self.registration.pushManager.subscribe({
      applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      userVisibleOnly: true, // required in chrome, to prevent sending without the user knowing
    });
    console.log("sw:subscribed");
  } catch (err) {
    console.error("sw:error", err);
  }
}
