import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { uploadFile } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "ファイルが選択されていません" },
        { status: 400 },
      );
    }

    // ファイルサイズをチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "ファイルサイズは5MB以下にしてください" },
        { status: 400 },
      );
    }

    // ファイル形式をチェック
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "サポートされていないファイル形式です" },
        { status: 400 },
      );
    }

    // 一意のファイル名を生成
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop() ?? "jpg";
    const fileName = `friend-sites/${timestamp}-${randomString}.${fileExtension}`;

    // Supabase Storageにアップロード
    await uploadFile(fileName, file, file.type);

    return NextResponse.json({
      success: true,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { success: false, error: "画像のアップロードに失敗しました" },
      { status: 500 },
    );
  }
}
