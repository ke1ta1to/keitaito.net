/**
 * アップロード機能の設定値
 */

export const UPLOAD_CONFIG = {
  // ファイルサイズ制限
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_OG_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB (OG画像用)

  // 許可されるファイル形式
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ] as const,

  // ファイル拡張子マッピング
  CONTENT_TYPE_TO_EXTENSION: {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  } as const,

  // Supabase Storageのパス
  PATHS: {
    FRIEND_SITES: "friend-sites",
    OG_IMAGES: "friend-sites/og",
  } as const,
} as const;

/**
 * ファイル形式が許可されているかチェック
 */
export function isAllowedImageType(contentType: string): boolean {
  return (UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES as readonly string[]).includes(
    contentType,
  );
}

/**
 * Content-Typeから適切なファイル拡張子を取得
 */
export function getFileExtension(contentType: string): string {
  return (
    UPLOAD_CONFIG.CONTENT_TYPE_TO_EXTENSION[
      contentType as keyof typeof UPLOAD_CONFIG.CONTENT_TYPE_TO_EXTENSION
    ] || "jpg"
  );
}

/**
 * 一意のファイル名を生成
 */
export function generateUniqueFileName(
  prefix: string,
  extension: string,
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${prefix}-${timestamp}-${randomString}.${extension}`;
}
