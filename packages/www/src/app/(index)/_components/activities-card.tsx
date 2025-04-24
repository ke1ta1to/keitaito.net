"use client";

import { useState } from "react";

import { OverviewCard } from "@/components/overview-card";
import type { Activity } from "@/data/activities";

interface ActivitiesCardProps {
  activities: Activity[];
  maxActivities: number;
}

export function ActivitiesCard({
  activities,
  maxActivities,
}: ActivitiesCardProps) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const displayedActivities = open
    ? activities
    : activities.slice(0, maxActivities + 1);

  return (
    <OverviewCard title="Activities">
      <ul className="relative space-y-4 before:absolute before:left-24 before:h-full before:border-l-8 before:border-gray-100">
        {displayedActivities.map((item) => (
          <li key={item.title} className="flex items-start">
            <div className="w-28 flex-shrink-0">{item.date}</div>
            <div>
              <div className="relative before:absolute before:-left-4 before:h-full before:border-l-8 before:border-teal-300">
                {item.title}
              </div>
              <div className="prose prose-sm mt-1">{item.description}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          className="cursor-pointer text-sm underline"
          onClick={toggleOpen}
        >
          {open ? "閉じる" : "もっと見る"}
        </button>
      </div>
    </OverviewCard>
  );
}
