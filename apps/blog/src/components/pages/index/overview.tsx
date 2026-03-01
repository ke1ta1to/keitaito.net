import { Activities } from "@repo/ui/components/activities";
import { Profile } from "@repo/ui/components/profile";

export async function Overview() {
  const activities = [
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
  ];

  const profile = {
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
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-1 md:order-0">
          <Profile profile={profile} />
        </div>
        <div className="order-2 md:order-0">
          <Activities activities={activities} />
        </div>
      </div>
      <div className="contents space-y-0 md:block md:space-y-4"></div>
    </div>
  );
}
