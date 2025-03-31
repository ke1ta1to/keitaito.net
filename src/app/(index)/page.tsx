import type { Activity } from "./_components/activities-card";
import { ActivitiesCard } from "./_components/activities-card";
import { ArticlesCard } from "./_components/articles-card";
import { ContactCard } from "./_components/contact-card";
import { ProfileCard } from "./_components/profile-card";
import { SkillsCard } from "./_components/skills-card";
import type { Work } from "./_components/works-card";
import { WorksCard } from "./_components/works-card";

const activities = [
  {
    date: "Aug. 2017",
    title: "Minecraft系のJava開発",
    description: <p>MODやBukkitプラグインを作成し配布など</p>,
  },
  {
    date: "Apr. 2020",
    title: "八千代松陰高等学校に入学",
    description: <p>内部進学にて普通科IGSコースへ</p>,
  },
  {
    date: "Apr. 2021",
    title: "所属高校の生徒や先生方向けに作成",
    description: (
      <p>
        Next.jsを用いた文化祭ホームページや、Google Apps Scriptを用いたGoogle
        DocsやSpreadsheetのためのユーティリティ作成など
      </p>
    ),
  },
  {
    date: "Dec. 2021",
    title: "UECスクール 高大連携・高大連携基礎プログラミングを修了",
    description: (
      <p>特別科目等履修生として「基礎プログラミングおよび演習」を受講</p>
    ),
  },
  {
    date: "Apr. 2023",
    title: "国立大学法人 電気通信大学に入学",
    description: <p>学校推薦型選抜にてI類メディア情報学プログラムへ</p>,
  },
  {
    date: "Aug. 2023",
    title: "UECアイディア実証コンテスト 2023において協賛企業賞を受賞",
    description: (
      <p>
        「模擬店における汎用的なモバイルオーダーシステムの提案」では株式会社ハートビーツ様より、「観光地活性化のための散策支援アプリの提案」では多摩信用金庫様より協賛企業賞を受賞
      </p>
    ),
  },
  {
    date: "Mar. 2024",
    title: "team411の副代表に就任",
    description: (
      <p>
        大学公認サークルであるteam411の副代表として、サークルの運営やイベントの企画運営、メンバーのサポートなどを行う
      </p>
    ),
  },
  {
    date: "Jan. 2025",
    title: "株式会社Undershaftにインターン",
    description: (
      <p>
        フロントエンド、バックエンドのエンジニアとして、実際のプロジェクトに参加し、開発経験を積む
      </p>
    ),
  },
  {
    date: "Feb. 2025",
    title: "八千代松陰学園にて土曜講座を開講",
    description: (
      <p>
        ホームページ作成講座を
        開講し、ウェブ制作の基礎やプログラミングの始め方を講義
      </p>
    ),
  },
  {
    date: "",
    title: "",
    description: <p></p>,
  },
] satisfies Activity[];

const works = [
  {
    title: "食神Wiki",
    description: <p>大学近くの飲食店である「食神」の情報をまとめたWiki</p>,
    url: "#",
    thumbnail: "/sample-cover.jpg",
  },
  {
    title: "モバイルオーダーシステム「MO」",
    description: (
      <p>
        模擬店における汎用的なモバイルオーダーシステム
        <br />
        サークルでチーム開発を行っています
      </p>
    ),
    url: "#",
    thumbnail: "/sample-cover.jpg",
  },
  {
    title: "ポートフォリオ",
    description: (
      <p>無駄に技術スタックを詰め込んだ、このポートフォリオサイトです</p>
    ),
    url: "#",
    thumbnail: "/sample-cover.jpg",
  },
] satisfies Work[];

export default async function IndexPage() {
  // 順番を逆にする
  const sortedActivities = activities.slice().reverse();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-1 md:order-none">
          <ProfileCard />
        </div>
        <div className="order-2 md:order-none">
          <ActivitiesCard activities={sortedActivities} />
        </div>
        <div className="order-6 md:order-none">
          <ContactCard />
        </div>
      </div>
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-3 md:order-none">
          <ArticlesCard />
        </div>
        <div className="order-4 md:order-none">
          <WorksCard works={works} />
        </div>
        <div className="order-5 md:order-none">
          <SkillsCard />
        </div>
      </div>
    </div>
  );
}
