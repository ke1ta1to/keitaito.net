"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { IconPencil, IconTrash } from "@tabler/icons-react";

import type { Activity } from "../_types";

interface ActivityTableProps {
  activities: Activity[];
  loading: boolean;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-48" />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Skeleton className="size-7" />
          <Skeleton className="size-7" />
        </div>
      </TableCell>
    </TableRow>
  ));
}

export function ActivityTable({
  activities,
  loading,
  onEdit,
  onDelete,
}: ActivityTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-50">Title</TableHead>
          <TableHead className="w-30">Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-25">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <SkeletonRows />
        ) : activities.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-muted-foreground h-24 text-center"
            >
              No activities found.
            </TableCell>
          </TableRow>
        ) : (
          activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.title}</TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {activity.date}
              </TableCell>
              <TableCell
                className="text-muted-foreground max-w-75 truncate"
                title={activity.description}
              >
                {activity.description}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(activity)}
                  >
                    <IconPencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(activity)}
                  >
                    <IconTrash className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
