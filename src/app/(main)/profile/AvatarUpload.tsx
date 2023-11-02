"use client";

import { Loader2Icon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { UploadButton } from "@/components/uploadthing";

import { updateProfilePicture } from "./actions";

export function AvatarUpload() {
  return (
    <UploadButton
      appearance={{
        button: ({ isUploading }) =>
          buttonVariants({
            variant: isUploading ? "secondary" : "default",
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
        allowedContent: "Bilddatei (.png, .jpg)",
      }}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        const file = res?.[0];
        if (!file) {
          return;
        }
        const url = file.url;
        updateProfilePicture(url);
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
