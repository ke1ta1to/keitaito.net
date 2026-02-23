import { Button } from "@repo/ui/components/ui/button";
import { Activities } from "@repo/ui/components/activities";

export default async function IndexPage() {
  return (
    <div>
      <p className="text-red-500">Hello</p>
      <Button variant="default" className="text-teal-500">
        Button
      </Button>
      <Activities
        activities={[
          {
            id: "1",
            date: "2024-01-01",
            title: "New Year's Day",
            description: "Celebrating the new year with family and friends.",
          },
          {
            id: "2",
            date: "2024-02-14",
            title: "Valentine's Day",
            description: "Spending time with loved ones and exchanging gifts.",
          },
        ]}
      />
    </div>
  );
}
