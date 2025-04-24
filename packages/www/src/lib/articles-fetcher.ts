import { z } from "zod";

const zennSchema = z.object({
  title: z.string(),
  path: z.string(),
  liked_count: z.number(),
  published_at: z.string(),
});

const qiitaSchema = z.object({
  title: z.string(),
  url: z.string(),
  likes_count: z.number(),
  created_at: z.string(),
});

export interface Article {
  title: string;
  url: string;
  liked_count: number;
  published_at: string;
  source?: "zenn" | "qiita";
}

export async function fetchArticles() {
  const fetchZennArticles = async () => {
    const zennUrl =
      "https://zenn.dev/api/articles?page=1&username=kk79it&count=96&order=latest";
    const res = await fetch(zennUrl);
    if (!res.ok) throw new Error("Failed to fetch Zenn articles");
    const data = await res.json();
    const parsedData = z.array(zennSchema).parse(data.articles);
    return parsedData;
  };

  const fetchQiitaArticles = async () => {
    const qiitaUrl =
      "https://qiita.com/api/v2/items?page=1&per_page=100&query=user:ke1ta1to";
    const res = await fetch(qiitaUrl);
    if (!res.ok) throw new Error("Failed to fetch Qiita articles");
    const data = await res.json();
    const parsedData = z.array(qiitaSchema).parse(data);
    return parsedData;
  };

  try {
    const [zennArticles, qiitaArticles] = await Promise.all([
      fetchZennArticles(),
      fetchQiitaArticles(),
    ]);

    const formattedZennArticles: Article[] = zennArticles.map((article) => ({
      title: article.title,
      url: `https://zenn.dev${article.path}`,
      liked_count: article.liked_count,
      published_at: article.published_at,
      source: "zenn",
    }));

    const formattedQiitaArticles: Article[] = qiitaArticles.map((article) => ({
      title: article.title,
      url: article.url,
      liked_count: article.likes_count,
      published_at: article.created_at,
      source: "qiita",
    }));

    const allArticles = [...formattedZennArticles, ...formattedQiitaArticles];
    allArticles.sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    );
    return allArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}
