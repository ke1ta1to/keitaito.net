"use client";

import { Activity } from "@/orval";

export interface ActivityListProps {
  activities?: Activity[];
}

export function ActivityList(props: ActivityListProps) {
  const { activities = [] } = props;
  return (
    <>
      <ul className="relative space-y-4 before:absolute before:left-24 before:h-full before:border-l-8 before:border-gray-100">
        {activities.map((item) => (
          <li key={item.id} className="flex items-start">
            <div className="w-28 shrink-0">{item.date}</div>
            <div className="flex flex-col space-y-1">
              <div className="relative before:absolute before:-left-4 before:h-full before:border-l-8 before:border-teal-300">
                {item.title}
              </div>
              <div>{item.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
