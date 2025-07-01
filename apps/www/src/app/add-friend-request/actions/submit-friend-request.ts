"use server";

import { prisma } from "@keitaito.net/db";
import { redirect } from "next/navigation";

import { handlePrismaError } from "../lib/error-handler";
import type { ActionResult, FriendRequestData } from "../types";

export async function submitFriendRequest(
  data: FriendRequestData,
): Promise<ActionResult> {
  try {
    // Prismaを使ってデータベースに保存
    await prisma.friendSite.create({
      data: {
        url: data.url,
        title: data.title,
        description: data.description || null,
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
