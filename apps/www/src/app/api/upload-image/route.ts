import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { uploadFile } from "@/lib/s3";
import {
  UPLOAD_CONFIG,
  isAllowedImageType,
  getFileExtension,
  generateUniqueFileName,
} from "@/lib/upload-config";

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

    // ファイルサイズをチェック
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `ファイルサイズは${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB以下にしてください`,
        },
        { status: 400 },
      );
    }

    // ファイル形式をチェック
    if (!isAllowedImageType(file.type)) {
      return NextResponse.json(
        { success: false, error: "サポートされていないファイル形式です" },
        { status: 400 },
      );
    }

    // 一意のファイル名を生成
    const fileExtension = getFileExtension(file.type);
    const fileName = `${UPLOAD_CONFIG.PATHS.FRIEND_SITES}/${generateUniqueFileName("upload", fileExtension)}`;

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
