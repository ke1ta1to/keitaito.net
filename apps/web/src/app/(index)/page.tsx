import { Button } from "@repo/ui/components/ui/button";
import { Activities } from "@repo/ui/components/pages/overview/activities";

export default async function IndexPage() {
  return (
    <div>
      <p className="text-red-500">Hello</p>
      <Button>Button</Button>
      <Activities
        activities={[
          {
            id: "1",
            title: "Activity 1",
            date: "2024-06-01",
            description: "Description for activity 1",
          },
        ]}
      />
    </div>
  );
}
