"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  IconActivity,
  IconArticle,
  IconBriefcase,
  IconCode,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { apiClient } from "@/lib/api-client";

const resources = [
  {
    key: "activities",
    label: "Activities",
    icon: IconActivity,
    href: "/activities",
  },
  { key: "articles", label: "Articles", icon: IconArticle, href: "/articles" },
  { key: "skills", label: "Skills", icon: IconCode, href: "/skills" },
  { key: "works", label: "Works", icon: IconBriefcase, href: "/works" },
] as const;

function useResourceCount(key: (typeof resources)[number]["key"]) {
  return useQuery({
    queryKey: [key],
    queryFn: () =>
      apiClient.GET(`/${key}`).then((res) => res.data?.length ?? 0),
  });
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((r) => (
          <ResourceCard key={r.key} resource={r} />
        ))}
      </div>
    </div>
  );
}

interface ResourceCardProps {
  resource: (typeof resources)[number];
}

function ResourceCard({ resource }: ResourceCardProps) {
  const { data: count, isLoading } = useResourceCount(resource.key);

  return (
    <Link href={resource.href}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {resource.label}
          </CardTitle>
          <resource.icon className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : count}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
