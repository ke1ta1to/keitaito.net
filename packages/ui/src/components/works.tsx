import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export interface WorksProps {
  children: React.ReactNode;
}

export function Works({ children }: WorksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Works</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">{children}</div>
      </CardContent>
    </Card>
  );
}

export interface WorkCardProps {
  title: string;
  thumbnailUrl?: string | null;
}

export function WorkCard({ title, thumbnailUrl }: WorkCardProps) {
  return (
    <Card className="pt-0">
      {thumbnailUrl ? (
        <Image
          alt={title}
          src={thumbnailUrl}
          width={640}
          height={360}
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="bg-muted aspect-video w-full" />
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export function WorksSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Works</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i} className="pt-0">
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
