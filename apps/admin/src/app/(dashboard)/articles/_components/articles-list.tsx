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
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";

type Article = components["schemas"]["Article"];

interface ArticlesListProps {
  articles: Article[];
}

export function ArticlesList({ articles }: ArticlesListProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.DELETE("/articles/{id}", { params: { path: { id } } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Article deleted");
    },
    onError: () => toast.error("Failed to delete article"),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Articles</h2>
        <Button asChild size="sm">
          <Link href="/articles/new">
            <IconPlus className="size-4" />
            New
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="max-w-xs truncate">{item.title}</TableCell>
              <TableCell>
                {item.source && (
                  <Badge variant="secondary">{item.source}</Badge>
                )}
              </TableCell>
              <TableCell>{item.liked_count}</TableCell>
              <TableCell className="whitespace-nowrap">
                {item.published_at}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/articles/edit/?id=${item.id}`}>
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
                        <AlertDialogTitle>Delete article?</AlertDialogTitle>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
