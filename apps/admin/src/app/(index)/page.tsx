import { Activities } from "@repo/ui/components/activities";
import { Button } from "@repo/ui/components/ui/button";

export default async function IndexPage() {
  return (
    <div>
      <p className="text-green-500">admin index page</p>
      <Activities
        activities={[
          {
            id: "1",
            title: "Admin Activity 1",
            description: "This is the first admin activity.",
            date: "2024-06-01",
          },
          {
            id: "2",
            title: "Admin Activity 2",
            description: "This is the second admin activity.",
            date: "2024-06-02",
          },
          {
            id: "3",
            title: "Admin Activity 3",
            description: "This is the third admin activity.",
            date: "2024-06-03",
          },
        ]}
      />
      <Button>Button</Button>
    </div>
  );
}
