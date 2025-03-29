import type { PropsWithChildren } from "react";

interface OverviewCardProps {
  title: string;
}

export function OverviewCard({
  title,
  children,
}: PropsWithChildren<OverviewCardProps>) {
  return (
    <div className="rounded border-t-4 border-t-teal-300 px-4 py-2 shadow">
      <div className="">{title}</div>
      <div className="my-2 h-0.5 bg-gray-100">{/* Divider */}</div>
      <div className="">{children}</div>
    </div>
  );
}
