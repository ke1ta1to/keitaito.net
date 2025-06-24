export interface Profile {
  name: string;
  birthday: Date;
  location: string;
  school: string;
  x: string;
  github: string;
  zenn: string;
  qiita: string;
}

export const profile = {
  name: "伊藤啓太\nKeita Ito",
  birthday: new Date(2004, 6, 9),
  location: "Tokyo, Japan",
  school: "電気通信大学\n情報理工学域 I類\nメディア情報学プログラム",
  x: "https://x.com/ke1ta1to",
  github: "https://github.com/ke1ta1to",
  zenn: "https://zenn.dev/kk79it",
  qiita: "https://qiita.com/ke1ta1to",
};

import type { ReactNode } from "react";

export interface Activity {
  date: string;
  title: string;
  description?: ReactNode;
}

export const activities = [
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
    date: "Mar. 2025",
    title: "UEC Bug Bountyにて特別賞を受賞",
    description: (
      <p>
        学内情報セキュリティ検査コンテスト「
        <a
          href="https://www.uec.ac.jp/news/announcement/2025/20250407_6895.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          UEC Bug Bounty 2024-2025
        </a>
        」において、バグバウンティ・プラットフォーム「IssueHunt」特別賞を受賞
      </p>
    ),
  },
] satisfies Activity[];

export interface Skills {
  special: {
    label: string;
    src: string;
  }[];
  lang: {
    label: string;
    src: string;
  }[];
}

export const skills = {
  special: [
    {
      label: "Amazon Web Services",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    },
    {
      label: "Cloudflare",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg",
    },
    {
      label: "Docker",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    },
    {
      label: "Firebase",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
    },
    {
      label: "Supabase",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
    },
    {
      label: "MySQL",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    },
    {
      label: "PostgreSQL",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    },
    {
      label: "Next.js",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    },
    {
      label: "Storybook",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg",
    },
    {
      label: "Terraform",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg",
    },
    {
      label: "React",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    },
    {
      label: "Vue.js",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
    },
    {
      label: "NestJS",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg",
    },
    {
      label: "jQuery",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jquery/jquery-original.svg",
    },
    {
      label: "Apache",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apache/apache-original.svg",
    },
    {
      label: "Electron",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/electron/electron-original.svg",
    },
    {
      label: "GitHub Actions",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg",
    },
    {
      label: "Unity",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg",
    },
  ],
  lang: [
    {
      label: "TypeScript",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    },
    {
      label: "Node.js",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    },
    {
      label: "Python",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    },
    {
      label: "Java",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
    },
    {
      label: "HTML",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    },
    {
      label: "Ruby",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
    },
    {
      label: "C",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
    },
    {
      label: "C#",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
    },
  ],
} satisfies Skills;
