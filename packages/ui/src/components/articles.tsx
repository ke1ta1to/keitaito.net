import { IconHeart } from "@tabler/icons-react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

import qiitaIcon from "@repo/ui/assets/qiita.svg";
import zennIcon from "@repo/ui/assets/zenn.svg";

export interface ArticlesProps {
  articles?: {
    title: string;
    url: string;
    liked_count: number;
    published_at: string;
    source?: "qiita" | "zenn" | null;
  }[];
}

export function Articles(props: ArticlesProps) {
  const { articles = [] } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {articles.map((article) => (
            <li key={article.url}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 py-3"
              >
                <span>
                  <h3 className="text-sm font-medium group-hover:underline">
                    {article.title}
                  </h3>
                  <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <IconHeart className="size-3" />
                      {article.liked_count}
                    </span>
                    <span>{article.published_at}</span>
                  </div>
                </span>
                {article.source && (
                  <Image
                    alt=""
                    src={{ zenn: zennIcon, qiita: qiitaIcon }[article.source]}
                    className="size-6"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ArticlesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {Array.from({ length: 3 }, (_, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 py-3"
            >
              <span>
                <Skeleton className="h-4 w-48" />
                <div className="mt-2 flex items-center gap-3">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </span>
              <Skeleton className="size-6" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
