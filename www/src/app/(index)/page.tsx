import type { ActivitiesProps } from "@/components/pages/index/activities";
import { Activities } from "@/components/pages/index/activities";

const activitiesMock = [
  {
    date: "Mar. 2020",
    title: "Started a new project",
    description: "Initiated a new open-source project on GitHub.",
  },
  {
    date: "Jul. 2021",
    title: "Spoke at a conference",
    description: "Presented a talk on web development best practices.",
  },
  {
    date: "Dec. 2022",
    title: "Launched a personal blog",
    description:
      "Started sharing articles and tutorials on my personal website.",
  },
] satisfies ActivitiesProps["activities"];

export default async function IndexPage() {
  return (
    <div>
      <Activities activities={activitiesMock} />
    </div>
  );
}
