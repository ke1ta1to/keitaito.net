import { ERROR_MESSAGES } from "../constants/error-messages";
import type { ActionResult } from "../types";

export function handlePrismaError(error: unknown): ActionResult {
  // redirect()によるエラーは正常な動作なので、再スローする
  if (error instanceof Error && error.message === "NEXT_REDIRECT") {
    throw error;
  }

  console.error("Error submitting friend request:", error);

  // Prismaのエラーハンドリング
  // instanceof は Server Actions でのシリアライゼーションで失敗するため、
  // エラーの構造とプロパティで判定する
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; message?: string };

    // P2002: 一意制約違反（URL重複など）
    if (prismaError.code === "P2002") {
      return {
        success: false,
        error: ERROR_MESSAGES.DUPLICATE_URL,
        field: "url",
      };
    }

    // P2025: レコードが見つからない
    if (prismaError.code === "P2025") {
      return {
        success: false,
        error: ERROR_MESSAGES.DATA_SAVE_FAILED,
      };
    }
  }

  // Prisma Client のその他のエラーをメッセージで判定
  const errorMessage = error instanceof Error ? error.message : String(error);

  // データベース接続エラー
  if (
    errorMessage.includes("database") ||
    errorMessage.includes("connection")
  ) {
    return {
      success: false,
      error: ERROR_MESSAGES.DATABASE_CONNECTION,
    };
  }

  // バリデーションエラー
  if (errorMessage.includes("validation") || errorMessage.includes("invalid")) {
    return {
      success: false,
      error: ERROR_MESSAGES.VALIDATION_ERROR,
    };
  }

  // その他の予期しないエラー
  return {
    success: false,
    error: ERROR_MESSAGES.GENERAL_ERROR,
  };
}
