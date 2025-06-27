import { ExternalLink, Heart, Newspaper } from "lucide-react";
import Image from "next/image";

import { OverviewCard } from "@/components/overview-card";
import type { Article } from "@/lib/articles-fetcher";

interface ArticlesCardProps {
  articles: Article[];
  maxArticles: number;
}

export function ArticlesCard({ articles, maxArticles }: ArticlesCardProps) {
  const displayedArticles = articles.slice(0, maxArticles + 1);

  return (
    <OverviewCard title="Articles">
      {displayedArticles.length === 0 ? (
        <div className="py-8 text-center">記事がありません</div>
      ) : (
        <ul>
          {displayedArticles.map((article) => (
            <li key={article.url}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-2"
              >
                {article.source ? (
                  {
                    zenn: <ZennIcon />,
                    qiita: <QiitaIcon />,
                  }[article.source]
                ) : (
                  <ArticleIcon />
                )}
                <div className="mr-auto ml-4">
                  <div className="group-hover:underline">{article.title}</div>
                  <div className="text-default-600 flex text-sm">
                    <span className="w-20">
                      {new Date(article.published_at).toLocaleDateString(
                        "ja-JP",
                      )}
                    </span>
                    <span className="ml-2">
                      <Heart size={16} className="inline" />
                      <span className="ml-1">{article.liked_count}</span>
                    </span>
                  </div>
                </div>
                <ExternalLink className="ml-4 h-auto w-5" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </OverviewCard>
  );
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

function ArticleIcon() {
  return <Newspaper className="h-auto w-6 flex-shrink-0" />;
}
