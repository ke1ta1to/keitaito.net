import { IconHeart } from "@tabler/icons-react";
import Image from "next/image";

import { OverviewCard } from "@/components/overview-card";

export interface Article {
  title: string;
  url: string;
  liked_count: number;
  published_at: string;
  source: "zenn" | "qiita";
}

export async function ArticlesCard() {
  const [zennArticles, qiitaArticles] = await Promise.all([
    getZennArticles(),
    getQiitaArticles(),
  ]);
  const articles = [...zennArticles, ...qiitaArticles].sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  );
  const maxArticles = 4;
  const displayedArticles = articles.slice(0, maxArticles + 1);

  return (
    <OverviewCard title="Articles">
      <ul>
        {displayedArticles.map((article) => (
          <li key={article.url}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-2"
            >
              {
                {
                  zenn: <ZennIcon />,
                  qiita: <QiitaIcon />,
                }[article.source]
              }
              <div className="ml-2">
                <div className="group-hover:underline">{article.title}</div>
                <div className="text-default-600 flex text-sm">
                  <span className="w-20">
                    {new Date(article.published_at).toLocaleDateString("ja-JP")}
                  </span>
                  <span className="ml-2">
                    <IconHeart size={16} className="inline" />
                    <span className="ml-1">{article.liked_count}</span>
                  </span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </OverviewCard>
  );
}

async function getZennArticles(): Promise<Article[]> {
  const url =
    "https://zenn.dev/api/articles?page=1&username=kk79it&count=96&order=latest";
  const res = await fetch(url).then((res) => res.json());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (res.articles as any[]).map<Article>((article) => ({
    title: article.title,
    url: `https://zenn.dev${article.path}`,
    liked_count: article.liked_count,
    published_at: article.published_at,
    source: "zenn",
  }));
}

async function getQiitaArticles(): Promise<Article[]> {
  const url =
    "https://qiita.com/api/v2/items?page=1&per_page=100&query=user:ke1ta1to";
  const res = await fetch(url).then((res) => res.json());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (res as any[]).map<Article>((article) => ({
    title: article.title,
    url: article.url,
    liked_count: article.likes_count,
    published_at: article.created_at,
    source: "qiita",
  }));
}

function ZennIcon() {
  return (
    <Image
      src="/zenn.svg"
      width={88.3}
      height={88.3}
      alt="Zenn"
      className="h-auto w-6 flex-shrink-0"
    />
  );
}

function QiitaIcon() {
  return (
    <Image
      src="/qiita.svg"
      width={400}
      height={400}
      alt="Qiita"
      className="h-auto w-6 flex-shrink-0"
    />
  );
}
