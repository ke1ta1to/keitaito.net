"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { useRef, useState } from "react";

import { useUpload } from "../_hooks/use-upload";

export function UploadsPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadMutation = useUpload();

  function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      uploadMutation.mutate(file, {
        onSuccess: (url) => {
          setUploadedUrl(url);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input ref={fileInputRef} type="file" className="max-w-sm" />
          <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {uploadMutation.isError && (
          <p className="text-sm text-red-500">{uploadMutation.error.message}</p>
        )}

        {uploadedUrl && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Uploaded URL:</p>
            <div className="flex items-center gap-2">
              <code className="bg-muted rounded px-2 py-1 text-sm">
                {uploadedUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(uploadedUrl)}
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
