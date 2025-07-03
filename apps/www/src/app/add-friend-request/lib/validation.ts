import { z } from "zod";

import { validatePublicUrl } from "@/lib/url-validation";

// URLの詳細バリデーション
const urlSchema = z
  .string()
  .min(1, "サイトURLは必須です")
  .refine(
    (url) => {
      const validation = validatePublicUrl(url);
      return validation.isValid;
    },
    (url) => {
      const validation = validatePublicUrl(url);
      return { message: validation.error || "無効なURLです" };
    },
  );

// フォーム用のスキーマ（Turnstileトークンは除外）
export const friendRequestFormSchema = z.object({
  url: urlSchema,
  title: z
    .string()
    .min(1, "サイトタイトルは必須です")
    .max(100, "サイトタイトルは100文字以内で入力してください"),
  description: z
    .string()
    .max(200, "サイト説明は200文字以内で入力してください")
    .optional(),
  author: z
    .string()
    .max(50, "サイト運営者名は50文字以内で入力してください")
    .optional(),
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください"),
  submittedNote: z
    .string()
    .max(500, "メッセージは500文字以内で入力してください")
    .optional(),
  ogImage: z.string().optional(),
});

// サーバーアクション用のスキーマ（Turnstileトークンを含む）
export const friendRequestSchema = friendRequestFormSchema.extend({
  turnstileToken: z.string().min(1, "セキュリティ認証が必要です"),
});

export type FriendRequestFormData = z.infer<typeof friendRequestFormSchema>;
export type FriendRequestData = z.infer<typeof friendRequestSchema>;
