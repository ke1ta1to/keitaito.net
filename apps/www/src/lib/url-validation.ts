/**
 * URL検証のためのユーティリティ関数
 */

// プライベートIPアドレスの範囲
const PRIVATE_IP_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^127\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00::/,
  /^fe80::/,
];

// ローカルホストの識別子
const LOCALHOST_IDENTIFIERS = ["localhost", "127.0.0.1", "::1"];

/**
 * プライベートIPアドレスかどうかを判定
 */
export function isPrivateIP(hostname: string): boolean {
  return PRIVATE_IP_RANGES.some((range) => range.test(hostname));
}

/**
 * ローカルホストかどうかを判定
 */
export function isLocalhost(hostname: string): boolean {
  return LOCALHOST_IDENTIFIERS.includes(hostname.toLowerCase());
}

/**
 * パブリックURLかどうかを検証
 */
export function validatePublicUrl(url: string): {
  isValid: boolean;
  error?: string;
} {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    return { isValid: false, error: "有効なURLを入力してください" };
  }

  // プロトコルチェック
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return { isValid: false, error: "HTTPまたはHTTPSのURLを入力してください" };
  }

  // ローカルホストチェック
  if (isLocalhost(parsedUrl.hostname)) {
    return { isValid: false, error: "ローカルホストは使用できません" };
  }

  // プライベートIPアドレスチェック
  if (isPrivateIP(parsedUrl.hostname)) {
    return { isValid: false, error: "プライベートIPアドレスは使用できません" };
  }

  return { isValid: true };
}

/**
 * URLが安全にアクセス可能かを検証（SSRF対策）
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return !isLocalhost(parsedUrl.hostname) && !isPrivateIP(parsedUrl.hostname);
  } catch {
    return false;
  }
}
