"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { useUpload } from "@/hooks/use-upload";

export function UploadsPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUpload();
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: (url) => {
        setUploadedUrl(url);
        toast.success("File uploaded");
      },
    });

    e.target.value = "";
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    toast.success("URL copied");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Uploads</h2>

      <div className="space-y-2">
        <Input ref={fileInputRef} type="file" onChange={handleFileChange} />
        {uploadMutation.isPending && (
          <div className="flex items-center gap-2 text-sm">
            <Spinner />
            Uploading...
          </div>
        )}
        {uploadMutation.isError && (
          <p className="text-sm text-red-500">{uploadMutation.error.message}</p>
        )}
      </div>

      {uploadedUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded URL:</p>
          <div className="flex items-center gap-2">
            <code className="bg-muted flex-1 truncate rounded px-3 py-2 text-sm">
              {uploadedUrl}
            </code>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? (
                <IconCheck className="size-4" />
              ) : (
                <IconCopy className="size-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
