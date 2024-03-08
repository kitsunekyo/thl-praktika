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

self.addEventListener("activate", async () => {
  console.log("sw:activate");
  if (!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY) {
    return;
  }
  try {
    await self.registration.pushManager.subscribe({
      applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      userVisibleOnly: true, // required in chrome, to prevent sending without the user knowing
    });
    console.log("sw:subscribed");
  } catch (err) {
    console.error("sw:error", err);
  }
});
