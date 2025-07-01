import { z } from "zod";

// フォーム用のスキーマ（Turnstileトークンは除外）
export const friendRequestFormSchema = z.object({
  url: z
    .string()
    .min(1, "サイトURLは必須です")
    .url("有効なURLを入力してください"),
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
});

// サーバーアクション用のスキーマ（Turnstileトークンを含む）
export const friendRequestSchema = friendRequestFormSchema.extend({
  turnstileToken: z.string().min(1, "セキュリティ認証が必要です"),
});

export type FriendRequestFormData = z.infer<typeof friendRequestFormSchema>;
export type FriendRequestData = z.infer<typeof friendRequestSchema>;
