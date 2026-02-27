import { Activities } from "@repo/ui/components/activities";
import { Button } from "@repo/ui/components/ui/button";

export default async function IndexPage() {
  return (
    <div>
      <p className="text-red-500">blog index page</p>
      <Activities
        activities={[
          {
            id: "1",
            title: "Blog Post 1",
            description: "This is the first blog post.",
            date: "2024-06-01",
          },
          {
            id: "2",
            title: "Blog Post 2",
            description: "This is the second blog post.",
            date: "2024-06-02",
          },
          {
            id: "3",
            title: "Blog Post 3",
            description: "This is the third blog post.",
            date: "2024-06-03",
          },
        ]}
      />
      <Button>Button</Button>
    </div>
  );
}
