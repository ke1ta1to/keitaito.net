import "server-only";

import * as cheerio from "cheerio";

import { uploadFile } from "./s3";
import {
  UPLOAD_CONFIG,
  getFileExtension,
  generateUniqueFileName,
  isAllowedImageType,
} from "./upload-config";
import { isSafeUrl } from "./url-validation";

export interface SiteInfo {
  title?: string;
  description?: string;
  ogImage?: string;
}

interface SiteInfoWithUrl extends SiteInfo {
  ogImageUrl?: string;
}

/**
 * 画像をダウンロードしてSupabase Storageに保存
 */
async function downloadAndStoreImage(imageUrl: string): Promise<string | null> {
  try {
    if (!isSafeUrl(imageUrl)) {
      console.warn("Unsafe URL blocked:", imageUrl);
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(imageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SiteInfoBot/1.0)",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn("Failed to fetch image:", response.status);
      return null;
    }

    // ファイルサイズチェック
    const contentLength = response.headers.get("content-length");
    if (
      contentLength &&
      parseInt(contentLength) > UPLOAD_CONFIG.MAX_OG_IMAGE_SIZE
    ) {
      console.warn("Image too large:", contentLength);
      return null;
    }

    // Content-Typeチェック
    const contentType = response.headers.get("content-type");
    if (!contentType || !isAllowedImageType(contentType)) {
      console.warn("Invalid content type:", contentType);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // ファイル名生成
    const extension = getFileExtension(contentType);
    const fileName = `${UPLOAD_CONFIG.PATHS.OG_IMAGES}/${generateUniqueFileName("og", extension)}`;

    // Supabase Storageにアップロード
    await uploadFile(fileName, buffer, contentType);

    return fileName;
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
}

/**
 * HTMLからメタ情報を抽出
 */
function extractMetaInfo(html: string, baseUrl: string): SiteInfoWithUrl {
  const $ = cheerio.load(html);

  // タイトル取得
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("title").text() ||
    "";

  // 説明取得
  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="twitter:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  // OG画像URL取得
  const ogImageUrl =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content");

  return {
    title: title.trim().substring(0, 100),
    description: description.trim().substring(0, 200),
    ogImageUrl: ogImageUrl ? new URL(ogImageUrl, baseUrl).href : undefined,
  };
}

/**
 * サイト情報を取得
 */
export async function fetchSiteInfo(url: string): Promise<SiteInfo> {
  if (!isSafeUrl(url)) {
    throw new Error("unsafe URL is not allowed");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SiteInfoBot/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const metaInfo = extractMetaInfo(html, url);

    // OG画像がある場合はダウンロード
    let ogImage: string | undefined;
    if (metaInfo.ogImageUrl) {
      const downloadedImagePath = await downloadAndStoreImage(
        metaInfo.ogImageUrl,
      );
      if (downloadedImagePath) {
        ogImage = downloadedImagePath;
      }
    }

    // 最終的なSiteInfo型のオブジェクトを返す
    const siteInfo: SiteInfo = {
      title: metaInfo.title,
      description: metaInfo.description,
      ogImage,
    };

    return siteInfo;
  } catch (error) {
    console.error("Error fetching site info:", error);
    throw error;
  }
}
