"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { IconTrash } from "@tabler/icons-react";
import { useRef } from "react";

import { useUpload } from "../_hooks/use-upload";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUpload();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: (url) => {
        onChange(url);
      },
    });

    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-start gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-20 w-20 rounded border object-cover"
          />
          <div className="flex flex-col gap-1">
            <code className="bg-muted truncate rounded px-2 py-1 text-xs">
              {value}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={() => onChange("")}
            >
              <IconTrash className="size-3.5" />
              Remove
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="max-w-sm"
        />
        {uploadMutation.isPending && (
          <span className="text-muted-foreground text-sm">Uploading...</span>
        )}
      </div>

      {uploadMutation.isError && (
        <p className="text-sm text-red-500">{uploadMutation.error.message}</p>
      )}
    </div>
  );
}
