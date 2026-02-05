"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadsPresign } from "@/orval/client";
import { useRef, useState } from "react";

type UploadState =
  | { status: "idle" }
  | { status: "presigning" }
  | { status: "uploading"; key: string }
  | { status: "success"; key: string; uploadUrl: string }
  | { status: "error"; message: string };

export function UploadsS3TestPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const presignMutation = useUploadsPresign();

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setState({ status: "presigning" });

    presignMutation.mutate(
      {
        data: {
          filename: file.name,
          content_type: file.type || "application/octet-stream",
        },
      },
      {
        onSuccess: async (data) => {
          setState({ status: "uploading", key: data.key });
          try {
            const res = await fetch(data.upload_url, {
              method: "PUT",
              headers: { "Content-Type": file.type || "application/octet-stream" },
              body: file,
            });
            if (!res.ok) {
              setState({ status: "error", message: `S3 PUT failed: ${res.status} ${res.statusText}` });
              return;
            }
            setState({ status: "success", key: data.key, uploadUrl: data.upload_url });
          } catch (e) {
            setState({ status: "error", message: e instanceof Error ? e.message : "Upload failed" });
          }
        },
        onError: (error) => {
          setState({ status: "error", message: error instanceof Error ? error.message : "Presign failed" });
        },
      },
    );
  };

  const isLoading = state.status === "presigning" || state.status === "uploading";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Uploads S3 Test Panel</h1>

      <div className="p-4 border rounded-lg space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          File Upload (Presign + S3 PUT)
        </h2>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              ref={fileInputRef}
              type="file"
              className="max-w-60"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpload}
              disabled={isLoading}
            >
              Upload to S3
            </Button>
          </div>

          {state.status !== "idle" && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                {isLoading && (
                  <span className="text-xs text-muted-foreground">
                    {state.status === "presigning" ? "Getting presigned URL..." : "Uploading to S3..."}
                  </span>
                )}
                {state.status === "success" && (
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Success
                  </span>
                )}
                {state.status === "error" && (
                  <span className="text-xs text-red-600 dark:text-red-400">
                    Error
                  </span>
                )}
              </div>
              <pre className="p-3 bg-muted rounded text-sm font-mono overflow-auto max-h-60">
                {state.status === "error"
                  ? state.message
                  : state.status === "success"
                    ? JSON.stringify({ key: state.key, upload_url: state.uploadUrl }, null, 2)
                    : state.status === "uploading"
                      ? JSON.stringify({ key: state.key, step: "uploading" }, null, 2)
                      : "Requesting presigned URL..."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
