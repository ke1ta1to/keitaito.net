"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { useTurnstile } from "../hooks/use-turnstile";
import { friendRequestFormSchema } from "../lib/validation";
import type {
  FriendRequestFormData,
  FriendRequestData,
} from "../lib/validation";
import type { ActionResult } from "../types";

import { Card } from "./ui/card";
import { ErrorMessage } from "./ui/error-message";
import { FormField } from "./ui/form-field";
import { ImageUpload } from "./ui/image-upload";
import { Turnstile } from "./ui/turnstile";

interface FriendRequestFormProps {
  action: (data: FriendRequestData) => Promise<ActionResult>;
}

export function FriendRequestForm({ action }: FriendRequestFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FriendRequestFormData>({
    resolver: zodResolver(friendRequestFormSchema),
  });

  const ogImageValue = watch("ogImage");

  const {
    state: { token: turnstileToken, hasError: turnstileError },
    actions: {
      handleVerify: handleTurnstileVerify,
      handleError: handleTurnstileError,
    },
    widgetRef,
    shouldReset,
  } = useTurnstile({
    resetOnError: false, // エラー時の自動リセットは無効にする
    autoResetErrorTypes: [], // 自動リセットするエラータイプを明示的に空にする
    onError: (errorType) => {
      console.log(`Turnstile error: ${errorType}`);
    },
  });

  const onSubmit = async (data: FriendRequestFormData) => {
    if (!turnstileToken) {
      handleTurnstileError();
      return;
    }

    try {
      const result = await action({
        ...data,
        turnstileToken,
      } as FriendRequestData);

      if (!result.success) {
        // フィールド固有のエラーがある場合
        if (result.field === "turnstileToken") {
          // Turnstile認証エラーの場合のみリセット
          if (shouldReset("verification") && widgetRef.current) {
            widgetRef.current.reset();
          }
          handleTurnstileError();
        } else if (result.field) {
          // その他のバリデーションエラーの場合、Turnstileはリセットしない
          setError(result.field as keyof FriendRequestFormData, {
            type: "server",
            message: result.error,
          });
        } else {
          // フォーム全体のエラー
          setError("root", {
            type: "server",
            message: result.error,
          });
        }
      }
      // 成功時はredirectされるので、ここには到達しない
    } catch (error) {
      console.error("Unexpected error in form submission:", error);

      // 予期しないエラーの場合はネットワークエラーとして扱う
      if (shouldReset("network") && widgetRef.current) {
        widgetRef.current.reset();
      }

      // 予期しないエラー
      setError("root", {
        type: "server",
        message: "予期しないエラーが発生しました。再度お試しください。",
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">相互リンク申請</h1>
          <p className="mt-2 text-gray-600">
            相互リンクを希望される方は、以下のフォームからお申し込みください。
            審査後、掲載の可否をご連絡いたします。
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* フォーム全体のエラーメッセージ */}
          {errors.root?.message && (
            <ErrorMessage message={errors.root.message} />
          )}

          {/* サイト情報 */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              サイト情報
            </h2>
            <div className="space-y-4">
              <FormField
                label="サイトURL"
                required
                error={errors.url?.message}
                helpText="あなたのサイトのURLを入力してください"
              >
                <input
                  type="url"
                  id="url"
                  {...register("url")}
                  placeholder="https://example.com"
                  className="block w-full"
                />
              </FormField>

              <FormField
                label="サイトタイトル"
                required
                error={errors.title?.message}
              >
                <input
                  type="text"
                  id="title"
                  {...register("title")}
                  placeholder="My Awesome Website"
                  className="block w-full"
                />
              </FormField>

              <FormField
                label="サイト説明"
                error={errors.description?.message}
                helpText="最大200文字程度で記載してください"
              >
                <textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                  placeholder="サイトの内容や特徴を簡潔に説明してください"
                  className="block w-full"
                />
              </FormField>

              <FormField label="サイト運営者名" error={errors.author?.message}>
                <input
                  type="text"
                  id="author"
                  {...register("author")}
                  placeholder="山田太郎"
                  className="block w-full"
                />
              </FormField>

              <FormField
                label="サイト画像"
                error={errors.ogImage?.message}
                helpText="サイトのOGイメージやロゴなど（任意）"
              >
                <ImageUpload
                  value={ogImageValue}
                  onChange={(fileName) => setValue("ogImage", fileName)}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>
          </div>

          {/* 申請者情報 */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              申請者情報
            </h2>
            <div className="space-y-4">
              <FormField
                label="メールアドレス"
                required
                error={errors.email?.message}
                helpText="審査結果のご連絡に使用します"
              >
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="your-email@example.com"
                  className="block w-full"
                />
              </FormField>

              <FormField
                label="メッセージ"
                error={errors.submittedNote?.message}
              >
                <textarea
                  id="submittedNote"
                  {...register("submittedNote")}
                  rows={4}
                  placeholder="誰か分かりにくい場合や、その他のメッセージがあればご記入ください"
                  className="block w-full"
                />
              </FormField>
            </div>
          </div>

          {/* Turnstile認証 */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              セキュリティ認証
            </h2>
            <Turnstile
              ref={widgetRef}
              onVerify={handleTurnstileVerify}
              onError={handleTurnstileError}
              onExpire={handleTurnstileError}
            />
            {turnstileError && (
              <p className="mt-2 text-sm text-red-600">
                セキュリティ認証が必要です。上記の認証を完了してください。
              </p>
            )}
          </div>

          {/* 注意事項 */}
          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-900">注意事項</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
              <li>申請内容を確認の上、掲載します</li>
              <li>掲載までには数日お時間をいただく場合があります</li>
              <li>
                掲載後、サイトの内容に大幅な変更があった場合は削除する場合があります
              </li>
              <li>相互リンクのため、こちらのサイトへのリンクもお願いします</li>
            </ul>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "送信中..." : "申請を送信"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
