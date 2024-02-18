"use client";

import { Loader2Icon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { UploadButton } from "@/components/uploadthing";
import { updateProfilePicture } from "@/modules/users/actions";

export function AvatarUpload() {
  return (
    <UploadButton
      appearance={{
        button: () =>
          buttonVariants({
            variant: "secondary",
            size: "sm",
          }),
        container: "flex w-max items-start",
        allowedContent: "text-muted-foreground",
      }}
      content={{
        button: ({ isUploading }) =>
          isUploading ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            "Profilbild wählen"
          ),
        allowedContent: ".jpg, oder .png. maximal 2MB",
      }}
      endpoint="imageUploader"
      onClientUploadComplete={async (res) => {
        const file = res?.[0];
        if (!file) {
          return;
        }
        const url = file.url;
        await updateProfilePicture(url);
      }}
      onUploadError={() => {
        toast({
          title: "Fehler beim Hochladen",
          description:
            "Dein Profilbild konnte nicht hochgeladen werden. Probiers später nochmal.",
        });
      }}
    />
  );
}
