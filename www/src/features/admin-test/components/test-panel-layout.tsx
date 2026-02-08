import type { ReactNode } from "react";

type Props = {
  title: string;
  sectionTitle?: string;
  children: ReactNode;
};

export function TestPanelLayout({ title, sectionTitle = "API Endpoints", children }: Props) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="p-4 border rounded-lg space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          {sectionTitle}
        </h2>
        {children}
      </div>
    </div>
  );
}
