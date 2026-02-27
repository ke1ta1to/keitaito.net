import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface ActivitiesProps {
  activities?: {
    id: string;
    title: string;
    description: string;
    date: string;
  }[];
}

export function Activities(props: ActivitiesProps) {
  const { activities = [] } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="relative space-y-4 before:absolute before:left-18 before:h-full before:border-l-8 before:border-gray-100">
          {activities.map((item) => (
            <li key={item.id} className="flex items-start">
              <div className="w-22 shrink-0">{item.date}</div>
              <div className="flex flex-col space-y-1">
                <div className="relative before:absolute before:-left-4 before:h-full before:border-l-8 before:border-teal-500">
                  {item.title}
                </div>
                <div>{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
