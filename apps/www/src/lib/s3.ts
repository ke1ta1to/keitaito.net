import "server-only";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Supabase Storage用S3クライアントを作成
 */
function createS3Client(): S3Client {
  return new S3Client({
    endpoint: process.env.S3_ENDPOINT || "http://127.0.0.1:54321/storage/v1/s3",
    region: process.env.S3_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
    disableHostPrefix: true,
  });
}

let _s3Client: S3Client | null = null;

/**
 * S3クライアントインスタンスを取得（遅延初期化）
 */
export const getS3Client = (): S3Client => {
  if (!_s3Client) {
    _s3Client = createS3Client();
  }
  return _s3Client;
};

export const bucketName = process.env.S3_BUCKET_NAME || "assets";

/**
 * ファイルをSupabase Storageにアップロード
 */
export async function uploadFile(
  key: string,
  file: File | Buffer | Uint8Array,
  contentType?: string,
): Promise<void> {
  const s3Client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body:
      file instanceof File ? new Uint8Array(await file.arrayBuffer()) : file,
    ContentType:
      contentType ||
      (file instanceof File ? file.type : "application/octet-stream"),
  });

  await s3Client.send(command);
}

/**
 * Supabase Storageからファイルを削除
 */
export async function deleteFile(key: string): Promise<void> {
  const s3Client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * ファイルアップロード用の署名付きURLを生成
 */
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600,
): Promise<string> {
  const s3Client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}
