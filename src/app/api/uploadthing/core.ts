import { captureException } from "@sentry/nextjs";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { getServerSession } from "@/modules/auth/next-auth";

const f = createUploadthing();

export const ourFileRouter = {
  avatar: f({
    "image/jpeg": { maxFileSize: "2MB", maxFileCount: 1 },
    "image/png": { maxFileSize: "2MB", maxFileCount: 1 },
    "image/gif": { maxFileSize: "2MB", maxFileCount: 1 },
    "image/heic": { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session) {
        throw new UploadThingError("Unauthorized");
      }
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadError(({ error }) => {
      captureException(error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
