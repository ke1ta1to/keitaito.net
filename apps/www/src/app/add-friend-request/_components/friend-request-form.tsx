import { Send } from "lucide-react";

interface FriendRequestFormProps {
  action: (formData: FormData) => Promise<void>;
}

export function FriendRequestForm({ action }: FriendRequestFormProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">相互リンク申請</h1>
          <p className="mt-2 text-gray-600">
            相互リンクを希望される方は、以下のフォームからお申し込みください。
            審査後、掲載の可否をご連絡いたします。
          </p>
        </div>

        <form action={action} className="space-y-6">
          {/* サイト情報 */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              サイト情報
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  サイトURL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  required
                  placeholder="https://example.com"
                  className="mt-1 block w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  あなたのサイトのURLを入力してください
                </p>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  サイトタイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="My Awesome Website"
                  className="mt-1 block w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  サイト説明
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="サイトの内容や特徴を簡潔に説明してください"
                  className="mt-1 block w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  最大200文字程度で記載してください
                </p>
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700"
                >
                  サイト運営者名
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  placeholder="山田太郎"
                  className="mt-1 block w-full"
                />
              </div>
            </div>
          </div>

          {/* 申請者情報 */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              申請者情報
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your-email@example.com"
                  className="mt-1 block w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  審査結果のご連絡に使用します
                </p>
              </div>

              <div>
                <label
                  htmlFor="submittedNote"
                  className="block text-sm font-medium text-gray-700"
                >
                  メッセージ
                </label>
                <textarea
                  id="submittedNote"
                  name="submittedNote"
                  rows={4}
                  placeholder="誰か分かりにくい場合や、その他のメッセージがあればご記入ください"
                  className="mt-1 block w-full"
                />
              </div>
            </div>
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
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <Send className="h-4 w-4" />
              申請を送信
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
