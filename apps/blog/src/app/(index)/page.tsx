import type { ActivitiesProps } from "./_components/activities";
import { Activities } from "./_components/activities";
import { Profile } from "./_components/profile";
import type { ProfileProps } from "./_components/profile";

const activitiesProps = {
  activities: [
    {
      id: "12",
      title: "株式会社ドワンゴにてインターン",
      date: "Aug 2025",
      description: "バックエンドのエンジニアとして、3ヶ月間プロジェクトに参加",
    },
    {
      id: "11",
      title: "LINEヤフー株式会社 SUMMER INTERNSHIP 2025に参加",
      date: "Aug 2025",
      description: "フロントエンドのエンジニアとして、実際のプロジェクトに参加",
    },
    {
      id: "10",
      title: "UEC Bug Bountyにて特別賞を受賞",
      date: "Mar 2025",
      description:
        "学内情報セキュリティ検査コンテスト「UEC Bug Bounty 2024-2025」において、バグバウンティ・プラットフォーム「IssueHunt」特別賞を受賞",
    },
    {
      id: "9",
      title: "八千代松陰学園にて土曜講座を開講",
      date: "Feb 2025",
      description:
        "ホームページ作成講座を開講し、ウェブ制作の基礎やプログラミングの始め方を講義",
    },
    {
      id: "8",
      title: "株式会社Undershaftにインターン",
      date: "Jan 2025",
      description:
        "フロントエンド、バックエンドのエンジニアとして、実際のプロジェクトに参加し、開発経験を積む",
    },
    {
      id: "7",
      title: "team411の副代表に就任",
      date: "Mar 2024",
      description:
        "大学公認サークルであるteam411の副代表として、サークルの運営やイベントの企画運営、メンバーのサポートなどを行う",
    },
    {
      id: "6",
      title: "UECアイディア実証コンテスト 2023において協賛企業賞を受賞",
      date: "Aug 2023",
      description:
        "「模擬店における汎用的なモバイルオーダーシステムの提案」では株式会社ハートビーツ様より、「観光地活性化のための散策支援アプリの提案」では多摩信用金庫様より協賛企業賞を受賞",
    },
    {
      id: "5",
      title: "国立大学法人 電気通信大学に入学",
      date: "Apr 2023",
      description: "学校推薦型選抜にてI類メディア情報学プログラムへ",
    },
    {
      id: "4",
      title: "UECスクール 高大連携・高大連携基礎プログラミングを修了",
      date: "Dec 2021",
      description:
        "特別科目等履修生として「基礎プログラミングおよび演習」を受講",
    },
    {
      id: "3",
      title: "所属高校の生徒や先生方向けに作成",
      date: "Apr 2021",
      description:
        "Next.jsを用いた文化祭ホームページや、Google Apps Scriptを用いたGoogle Docsのためのユーティリティ作成など",
    },
    {
      id: "2",
      title: "八千代松陰高等学校に入学",
      date: "Apr 2020",
      description: "内部進学にて普通科IGSコースへ",
    },
    {
      id: "1",
      title: "Minecraft系のJava開発",
      date: "Aug 2017",
      description: "MODやBukkitプラグインを作成し配布など",
    },
  ],
} satisfies ActivitiesProps;

const profileProps = {
  profile: {
    name: "Keita Ito",
    age: "21",
    location: "Tokyo, Japan",
    school: "The University of Electro-Communications",
    image_url: "https://avatars.githubusercontent.com/u/65676193?v=4",
    social_links: {
      github: "https://github.com/ke1ta1to",
      twitter: "https://x.com/ke1ta1to",
      qiita: "https://qiita.com/ke1ta1to",
      zenn: "https://zenn.dev/kk79it",
    },
  },
} satisfies ProfileProps;

export default async function IndexPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-2 md:order-0">
          <Activities {...activitiesProps} />
        </div>
      </div>
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-1 md:order-0">
          <Profile {...profileProps} />
        </div>
      </div>
    </div>
  );
}
