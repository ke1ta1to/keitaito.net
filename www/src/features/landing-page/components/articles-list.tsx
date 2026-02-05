import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Article } from "@/orval";
import { format, parseISO } from "date-fns";
import { Heart } from "lucide-react";
import Image from "next/image";

import zennIcon from "@/assets/zenn.svg";
import qiitaIcon from "@/assets/qiita.svg";

export interface ArticlesListProps {
  articles?: Article[];
}

export function ArticlesList(props: ArticlesListProps) {
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
                className="flex group py-3 items-center gap-3 justify-between"
              >
                <span>
                  <h3 className="text-sm font-medium group-hover:underline">
                    {article.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="size-3" />
                      {article.liked_count}
                    </span>
                    <span>{format(parseISO(article.published_at), "PPP")}</span>
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
