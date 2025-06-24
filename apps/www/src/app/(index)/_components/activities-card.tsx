"use client";

import { useEffect, useRef, useState } from "react";

import { OverviewCard } from "@/components/overview-card";
import type { Activity } from "@/constants/data";
import { cn } from "@/utils/cn";

interface ActivitiesCardProps {
  activities: Activity[];
  maxActivities: number;
}

export function ActivitiesCard({
  activities,
  maxActivities,
}: ActivitiesCardProps) {
  const [open, setOpen] = useState(false);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [itemHeights, setItemHeights] = useState<number[]>([]);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const heights = itemRefs.current.map((item) =>
      item ? item.scrollHeight : 0,
    );
    setItemHeights(heights);
  }, [activities]);

  const getItemStyle = (index: number) => {
    const isHidden = index > maxActivities;
    if (!isHidden) return {};

    const height = itemHeights[index] || 0;
    return {
      maxHeight: open ? `${height}px` : "0px",
      ...(open ? {} : { marginTop: 0, marginBottom: 0 }),
    };
  };

  const getItemClassName = (index: number) => {
    const isHidden = index > maxActivities;

    return cn(
      "flex items-start overflow-hidden transition-all duration-300 ease-in-out",
      isHidden && (open ? "opacity-100" : "opacity-0"),
    );
  };

  if (activities.length === 0) {
    return (
      <OverviewCard title="Activities">
        <p className="text-neutral-500">アクティビティがありません</p>
      </OverviewCard>
    );
  }

  return (
    <OverviewCard title="Activities">
      <ul className="relative space-y-4 before:absolute before:left-24 before:h-full before:border-l-8 before:border-gray-100">
        {activities.map((item, index) => (
          <li
            key={item.title}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={getItemClassName(index)}
            style={getItemStyle(index)}
          >
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
      {activities.length > maxActivities && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            className="cursor-pointer text-sm underline"
            onClick={toggleOpen}
          >
            {open ? "閉じる" : "もっと見る"}
          </button>
        </div>
      )}
    </OverviewCard>
  );
}
