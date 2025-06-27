import { Home } from "lucide-react";
import Link from "next/link";

import AppLayout from "@/components/app-layout";

export default function NotFoundPage() {
  return (
    <AppLayout>
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="max-w-lg space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-primary text-8xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold text-neutral-800">
              ページが見つかりません
            </h2>
            <p className="text-neutral-600">
              お探しのページは移動または削除された可能性があります。
              <br />
              URLをご確認ください。
            </p>
          </div>
          <Link
            href="/"
            className="bg-primary-500 hover:bg-primary-600 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-white transition-colors"
          >
            <Home className="h-5 w-5" />
            ホームに戻る
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
