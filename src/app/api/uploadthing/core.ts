import { type FileRouter, createUploadthing } from "uploadthing/next";

import { getServerSession } from "@/modules/auth/getServerSession";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    "image/jpeg": { maxFileSize: "2MB", maxFileCount: 1 },
    "image/png": { maxFileSize: "2MB", maxFileCount: 1 },
    "image/gif": { maxFileSize: "2MB", maxFileCount: 1 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await getServerSession();
      // If you throw, the user will not be able to upload
      if (!session) throw new Error("Unauthorized");
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadError(({ error }) => {
      console.error(error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
