import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { fetchSiteInfo } from "@/lib/site-info-fetcher";
import { validatePublicUrl } from "@/lib/url-validation";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URLが指定されていません" },
        { status: 400 },
      );
    }

    // URLの詳細なバリデーション
    const validation = validatePublicUrl(url);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    const siteInfo = await fetchSiteInfo(url);

    return NextResponse.json({
      success: true,
      data: siteInfo,
    });
  } catch (error) {
    console.error("Site info fetch error:", error);

    let errorMessage = "サイト情報の取得に失敗しました";

    if (error instanceof Error) {
      if (
        error.message.includes("fetch failed") ||
        error.message.includes("ECONNREFUSED")
      ) {
        errorMessage =
          "指定されたURLにアクセスできませんでした。URLを確認してください";
      } else if (error.message.includes("timeout")) {
        errorMessage =
          "サイトの応答がタイムアウトしました。時間をおいて再試行してください";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
