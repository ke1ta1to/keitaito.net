"use client";

import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (fileName: string | undefined) => void;
  disabled?: boolean;
  error?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  error,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    value ? `/assets/${value}` : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.fileName);
        setPreviewUrl(`/assets/${result.fileName}`);
      } else {
        alert(result.error || "画像のアップロードに失敗しました");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("画像のアップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {previewUrl ? (
        <div className="relative">
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-gray-50">
            <Image
              src={previewUrl}
              alt="アップロード画像のプレビュー"
              fill
              className="object-cover"
              onError={() => {
                setPreviewUrl(null);
                onChange(undefined);
              }}
            />
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <p className="text-sm text-gray-600">アップロード中...</p>
            </>
          ) : (
            <>
              <div className="mb-2 rounded-full bg-gray-200 p-3">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mb-1 text-sm font-medium text-gray-700">
                画像をアップロード
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, GIF, WebP (最大5MB)
              </p>
            </>
          )}
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="text-xs text-gray-500">
        <div className="flex items-start gap-1">
          <ImageIcon className="mt-0.5 h-3 w-3 flex-shrink-0" />
          <span>
            サイトのOGイメージやロゴ画像をアップロードしてください（任意）
          </span>
        </div>
      </div>
    </div>
  );
}
