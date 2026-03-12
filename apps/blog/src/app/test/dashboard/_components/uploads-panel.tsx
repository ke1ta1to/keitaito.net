"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { apiClient } from "./api-client";

export function UploadsPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const res = await apiClient.POST("/uploads", {
        body: {
          filename: file.name,
          content_type: file.type || "application/octet-stream",
          content_length: file.size,
        },
      });
      if (!res.data) {
        throw new Error("Failed to get presigned URL");
      }

      const putRes = await fetch(res.data.url, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!putRes.ok) {
        throw new Error("Failed to upload file");
      }

      return `/uploads/${res.data.key}`;
    },
    onSuccess: (url) => {
      setUploadedUrl(url);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
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
