import type { Work } from "@/app/(index)/_components/works-card";

export const works = [
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
