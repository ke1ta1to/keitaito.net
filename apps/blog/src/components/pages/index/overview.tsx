import type { ActivitiesProps } from "@repo/ui/components/activities";
import { Activities } from "@repo/ui/components/activities";
import type { ArticlesProps } from "@repo/ui/components/articles";
import { Articles } from "@repo/ui/components/articles";
import type { ProfileProps } from "@repo/ui/components/profile";
import { Profile } from "@repo/ui/components/profile";

export async function Overview() {
  const activitiesProps = {
    activities: [
      {
        id: "1",
        title: "Blog Post 1",
        description: "This is the first blog post.",
        date: "Jan 2026",
      },
      {
        id: "2",
        title: "Blog Post 2",
        description: "This is the second blog post.",
        date: "Feb 2026",
      },
      {
        id: "3",
        title: "Blog Post 3",
        description: "This is the third blog post.",
        date: "Mar 2026",
      },
    ],
  } as const satisfies ActivitiesProps;

  const profileProps = {
    profile: {
      name: "John Doe",
      age: "30",
      location: "New York",
      school: "University of Chicago",
      image_url: "https://picsum.photos/200",
      social_links: {
        twitter: "https://twitter.com/johndoe",
        github: "https://github.com/johndoe",
        zenn: "https://zenn.dev/johndoe",
        qiita: "https://qiita.com/johndoe",
      },
    },
  } as const satisfies ProfileProps;

  const articlesProps = {
    articles: [
      {
        title: "Next.js 16 の新機能まとめ",
        url: "https://zenn.dev/kk79it/articles/nextjs-16-features",
        liked_count: 42,
        published_at: "2025年3月1日",
        source: "zenn",
      },
      {
        title: "TypeScript 5.5 の新機能まとめ",
        url: "https://qiita.com/kk79it/items/1234567890abcdef",
        liked_count: 30,
        published_at: "2025年2月15日",
        source: "qiita",
      },
      {
        title: "React 18 の新機能まとめ",
        url: "https://zenn.dev/kk79it/articles/react-18-features",
        liked_count: 25,
        published_at: "2025年1月20日",
        source: "zenn",
      },
    ],
  } as const satisfies ArticlesProps;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-1 md:order-0">
          <Profile {...profileProps} />
        </div>
        <div className="order-2 md:order-0">
          <Activities {...activitiesProps} />
        </div>
      </div>
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-3 md:order-0">
          <Articles {...articlesProps} />
        </div>
      </div>
    </div>
  );
}
