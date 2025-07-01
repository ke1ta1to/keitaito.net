import { redirect } from "next/navigation";

import { FriendRequestForm } from "./_components/friend-request-form";

export const metadata = {
  title: "相互リンク申請",
  description:
    "相互リンクの申請フォームです。サイト情報を入力して申請してください。",
};

async function submitFriendRequest(formData: FormData) {
  "use server";

  // フォームデータの取得
  const url = formData.get("url") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const author = formData.get("author") as string;
  const submittedBy = formData.get("submittedBy") as string;
  const email = formData.get("email") as string;
  const submittedNote = formData.get("submittedNote") as string;

  // バリデーション
  if (!url || !title || !submittedBy || !email) {
    throw new Error("必須項目が入力されていません");
  }

  // TODO: ここでPrismaを使ってデータベースに保存
  console.log("Friend request submitted:", {
    url,
    title,
    description: description || null,
    author: author || null,
    submittedBy,
    email,
    submittedNote: submittedNote || null,
  });

  // 送信完了後は成功ページまたはトップページにリダイレクト
  redirect("/?submitted=true");
}

export default function AddFriendRequestPage() {
  return <FriendRequestForm action={submitFriendRequest} />;
}
