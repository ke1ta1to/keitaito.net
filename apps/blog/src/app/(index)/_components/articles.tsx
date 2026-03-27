import { IconHeart } from "@tabler/icons-react";
import Image from "next/image";

import qiitaIcon from "../_assets/qiita.svg";
import zennIcon from "../_assets/zenn.svg";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ArticlesProps {
  articles: {
    title: string;
    url: string;
    liked_count: number;
    published_at: string;
    source: "qiita" | "zenn" | null;
  }[];
}

export function Articles(props: ArticlesProps) {
  const { articles } = props;

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
