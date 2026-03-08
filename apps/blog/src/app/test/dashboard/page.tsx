"use client";

import { Button } from "@repo/ui/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

import { ActivityFormSheet } from "./_components/activity-form-sheet";
import { ActivityTable } from "./_components/activity-table";
import { DeleteConfirmDialog } from "./_components/delete-confirm-dialog";
import type { Activity } from "./_types";

export default function TestDashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Activity | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/activities");
      const data = await res.json();
      setActivities(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleCreate = () => {
    setEditTarget(null);
    setSheetOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditTarget(activity);
    setSheetOpen(true);
  };

  const handleDelete = (activity: Activity) => {
    setDeleteTarget(activity);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: {
    title: string;
    date: string;
    description: string;
  }) => {
    if (editTarget) {
      await fetch(`/api/activities/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    await fetchActivities();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/activities/${deleteTarget.id}`, { method: "DELETE" });
    await fetchActivities();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium">Activities</h1>
          <p className="text-muted-foreground text-xs">
            Manage your activities.
          </p>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <IconPlus data-icon="inline-start" className="size-3.5" />
          New
        </Button>
      </div>

      <ActivityTable
        activities={activities}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ActivityFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        activity={editTarget}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        activity={deleteTarget}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
