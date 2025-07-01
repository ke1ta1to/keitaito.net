"use server";

import { prisma } from "@keitaito.net/db";
import { redirect } from "next/navigation";

import { handlePrismaError } from "../lib/error-handler";
import { verifyTurnstileToken } from "../lib/turnstile-verification";
import type { FriendRequestData } from "../lib/validation";
import type { ActionResult } from "../types";

export async function submitFriendRequest(
  data: FriendRequestData,
): Promise<ActionResult> {
  try {
    // Turnstileトークンを検証
    const turnstileResult = await verifyTurnstileToken(data.turnstileToken);
    if (!turnstileResult.success) {
      return {
        success: false,
        error: turnstileResult.error || "セキュリティ認証に失敗しました",
        field: "turnstileToken",
      };
    }

    // Prismaを使ってデータベースに保存
    await prisma.friendSite.create({
      data: {
        url: data.url,
        title: data.title,
        description: data.description || null,
        ogImage: data.ogImage || null,
        author: data.author || null,
        submittedBy: data.email, // メールアドレスを申請者として使用
        submittedNote: data.submittedNote || null,
        status: "PENDING", // デフォルトは承認待ち
        isActive: false, // 承認前は非表示
      },
    });

    console.log("Friend request submitted successfully:", {
      url: data.url,
      title: data.title,
      email: data.email,
    });

    // 送信完了後は申請完了ページにリダイレクト
    redirect("/add-friend-request?submitted=true");
  } catch (error) {
    return handlePrismaError(error);
  }
}
