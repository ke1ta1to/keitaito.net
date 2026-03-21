"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useRef } from "react";

import { useUpload } from "@/hooks/use-upload";

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

    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-start gap-2">
          <Image
            src={value}
            alt="Preview"
            width={80}
            height={80}
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
        {uploadMutation.isPending && <Spinner />}
      </div>

      {uploadMutation.isError && (
        <p className="text-sm text-red-500">{uploadMutation.error.message}</p>
      )}
    </div>
  );
}
