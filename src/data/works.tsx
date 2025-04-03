import type { Work } from "@/app/(index)/_components/works-card";

export const works = [
  {
    title: "食神Wiki",
    description: <p>大学近くの飲食店である「食神」の情報をまとめたWiki</p>,
    url: "/works/shokujin-wiki",
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
    url: "/works/mo",
    thumbnail: "/sample-cover.jpg",
  },
  {
    title: "ポートフォリオ",
    description: (
      <p>無駄に技術スタックを詰め込んだ、このポートフォリオサイトです</p>
    ),
    url: "/works/portfolio",
    thumbnail: "/sample-cover.jpg",
  },
  {
    title: "第74回調布祭ウェブサイト",
    description: (
      <p>2024年11月に開催された電通大の学園祭「調布祭」のウェブサイト</p>
    ),
    url: "/works/chofusai",
    thumbnail: "/sample-cover.jpg",
  },
  {
    title: "UEC 3D Map",
    description: <p>電気通信大学をウェブ上で3Dで見ることができます</p>,
    url: "/works/uec-3d-map",
    thumbnail: "/sample-cover.jpg",
  },
  {
    title: "りさプロ",
    description: (
      <p>
        授業で作成したJavaのゲームです。
        <br />
        AWSを組み込んだオンライン機能やウェブサイトを作成しました
      </p>
    ),
    url: "/works/risa-pro",
    thumbnail: "/sample-cover.jpg",
  },
] satisfies Work[];
