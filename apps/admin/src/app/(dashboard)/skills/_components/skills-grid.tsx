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

type Skill = components["schemas"]["Skill"];

interface SkillsGridProps {
  skills: Skill[];
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.DELETE("/skills/{id}", { params: { path: { id } } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill deleted");
    },
    onError: () => toast.error("Failed to delete skill"),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Skills</h2>
        <Button asChild size="sm">
          <Link href="/skills/new">
            <IconPlus className="size-4" />
            New
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {skills.map((item) => (
          <Card key={item.id} className="relative">
            <CardContent className="flex items-center gap-3 p-3">
              <Image
                src={item.icon_url}
                alt={item.name}
                width={32}
                height={32}
                className="size-8 rounded"
              />
              <span className="flex-1 truncate text-sm font-medium">
                {item.name}
              </span>
              <div className="flex gap-1">
                <Button asChild variant="ghost" size="icon" className="size-7">
                  <Link href={`/skills/edit/?id=${item.id}`}>
                    <IconPencil className="size-3.5" />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={deleteMutation.isPending}
                    >
                      <IconTrash className="size-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete skill?</AlertDialogTitle>
                      <AlertDialogDescription>
                        &quot;{item.name}&quot; will be permanently deleted.
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
