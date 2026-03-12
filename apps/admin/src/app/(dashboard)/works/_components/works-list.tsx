"use client";

import type { components } from "@repo/api-client/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";

type Work = components["schemas"]["Work"];

interface WorksListProps {
  works: Work[];
}

export function WorksList({ works }: WorksListProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.DELETE("/works/{id}", { params: { path: { id } } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["works"] });
      toast.success("Work deleted");
    },
    onError: () => toast.error("Failed to delete work"),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Works</h2>
        <Button asChild size="sm">
          <Link href="/works/new">
            <IconPlus className="size-4" />
            New
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {works.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center gap-4 p-3">
              {item.thumbnail_url && (
                <Image
                  src={item.thumbnail_url}
                  alt={item.title}
                  width={64}
                  height={48}
                  className="h-12 w-16 rounded border object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.slug}</p>
              </div>
              <div className="flex gap-1">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/works/edit/?id=${item.id}`}>
                    <IconPencil className="size-4" />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleteMutation.isPending}
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete work?</AlertDialogTitle>
                      <AlertDialogDescription>
                        &quot;{item.title}&quot; will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
