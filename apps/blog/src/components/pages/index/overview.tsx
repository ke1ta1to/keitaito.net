import type { ActivitiesProps } from "@repo/ui/components/activities";
import { Activities } from "@repo/ui/components/activities";
import type { ArticlesProps } from "@repo/ui/components/articles";
import { Articles } from "@repo/ui/components/articles";
import type { ProfileProps } from "@repo/ui/components/profile";
import { Profile } from "@repo/ui/components/profile";
import { Skills } from "@repo/ui/components/skills";
import type { SkillsProps } from "@repo/ui/components/skills";
import { Works } from "@repo/ui/components/works";
import type { WorksProps } from "@repo/ui/components/works";

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

  const worksProps = {
    works: [
      {
        id: "1",
        title: "Work 1",
        slug: "work-1",
        content: "This is the first work.",
        thumbnail_url: "https://picsum.photos/600/400?random=1",
      },
      {
        id: "2",
        title: "Work 2",
        slug: "work-2",
        content: "This is the second work.",
        thumbnail_url: "https://picsum.photos/600/400?random=2",
      },
      {
        id: "3",
        title: "Work 3",
        slug: "work-3",
        content: "This is the third work.",
        thumbnail_url: "https://picsum.photos/600/400?random=3",
      },
    ],
  } as const satisfies WorksProps;

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

  const skillsProps = {
    skills: [
      {
        id: "1",
        name: "JavaScript",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      },
      {
        id: "2",
        name: "TypeScript",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        id: "3",
        name: "React",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      },
      {
        id: "4",
        name: "Next.js",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        id: "5",
        name: "Node.js",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      },
    ],
  } as const satisfies SkillsProps;

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
          <Works {...worksProps} />
        </div>
        <div className="order-4 md:order-0">
          <Articles {...articlesProps} />
        </div>
        <div className="order-5 md:order-0">
          <Skills {...skillsProps} />
        </div>
      </div>
    </div>
  );
}
