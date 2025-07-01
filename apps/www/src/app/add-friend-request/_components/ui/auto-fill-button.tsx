"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

import type { SiteInfo } from "@/lib/site-info-fetcher";
import { validatePublicUrl } from "@/lib/url-validation";

interface AutoFillButtonProps {
  url: string;
  onSuccess: (data: SiteInfo) => void;
  disabled?: boolean;
}

export function AutoFillButton({
  url,
  onSuccess,
  disabled,
}: AutoFillButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutoFill = async () => {
    if (!url || !url.trim()) {
      setError("URLを入力してください");
      return;
    }

    // URLの詳細なバリデーション
    const validation = validatePublicUrl(url);
    if (!validation.isValid) {
      setError(validation.error || "無効なURLです");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fetch-site-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.data);
        setError(null);
      } else {
        setError(result.error || "サイト情報の取得に失敗しました");
      }
    } catch (error) {
      console.error("Auto fill error:", error);
      setError("サイト情報の取得中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleAutoFill}
        disabled={disabled || isLoading || !url?.trim()}
        className="focus:ring-primary-500 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {isLoading ? "取得中..." : "自動入力"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        URLからサイトのタイトル、説明、画像を自動で取得します
      </p>
    </div>
  );
}
