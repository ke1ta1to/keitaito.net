"use client";

import { CheckCircle, Home, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Card } from "./ui/card";

export function SubmissionSuccess() {
  useEffect(() => {
    // ページ表示時にトップへスクロール
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <div className="text-center">
          {/* 成功アイコン */}
          <div className="bg-primary-100 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle className="text-primary-600 h-8 w-8" />
          </div>

          {/* メインメッセージ */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">
              申請を受け付けました
            </h1>
            <p className="mt-2 text-gray-600">
              相互リンクの申請をありがとうございます。
              内容を確認の上、掲載の可否をご連絡いたします。
            </p>
          </div>

          {/* 詳細情報 */}
          <div className="bg-primary-50 mt-6 rounded-md p-4">
            <h2 className="text-primary-900 text-sm font-medium">
              今後の流れについて
            </h2>
            <ul className="text-primary-700 mt-2 space-y-1 text-sm">
              <li>• 申請内容を確認いたします</li>
              <li>• 審査には数日お時間をいただく場合があります</li>
              <li>• 結果は申請時のメールアドレスにご連絡いたします</li>
              <li>• 承認後、サイトに掲載されます</li>
            </ul>
          </div>

          {/* アクションボタン */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <Home className="h-4 w-4" />
              ホームに戻る
            </Link>
            <Link
              href="/add-friend-request"
              className="focus:ring-primary-500 inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <Plus className="h-4 w-4" />
              新しい申請をする
            </Link>
          </div>

          {/* 注意事項 */}
          <div className="mt-6 text-xs text-gray-500">
            ご質問やお問い合わせがございましたら、
            <Link href="/" className="text-primary-600 hover:text-primary-500">
              こちら
            </Link>
            からお気軽にご連絡ください。
          </div>
        </div>
      </Card>
    </div>
  );
}
