interface ActivitiesListProps {
  activities: {
    date: string;
    title: string;
    description: string;
  }[];
}

export function ActivitiesList(props: ActivitiesListProps) {
  const { activities } = props;

  return (
    <ul className="before:border-muted relative space-y-4 before:absolute before:left-24 before:h-full before:border-l-8">
      {activities.map((item) => (
        <li key={item.title} className={"flex items-start"}>
          <div className="w-28 shrink-0">{item.date}</div>
          <div>
            <div className="before:border-primary relative before:absolute before:-left-4 before:h-full before:border-l-8">
              {item.title}
            </div>
            <div className="mt-1 text-sm">{item.description}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
