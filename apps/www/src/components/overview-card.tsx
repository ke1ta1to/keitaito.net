import type { ComponentProps, PropsWithChildren } from "react";

import { cn } from "@/utils/cn";

interface OverviewCardProps extends ComponentProps<"div"> {
  title: string;
}

export function OverviewCard({
  title,
  children,
  className,
  ...props
}: PropsWithChildren<OverviewCardProps>) {
  return (
    <div
      className={cn("rounded bg-white px-4 pt-2 pb-4 shadow", className)}
      {...props}
    >
      <h2>{title}</h2>
      <div className="my-4 mt-2 h-0.5 bg-gray-100"></div>
      {children}
    </div>
  );
}
