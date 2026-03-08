"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { IconLoader2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import type { Activity } from "../_types";

interface ActivityFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity | null;
  onSubmit: (data: {
    title: string;
    date: string;
    description: string;
  }) => Promise<void>;
}

export function ActivityFormSheet({
  open,
  onOpenChange,
  activity,
  onSubmit,
}: ActivityFormSheetProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEdit = activity !== null;

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setDate(activity.date);
      setDescription(activity.description);
    } else {
      setTitle("");
      setDate("");
      setDescription("");
    }
  }, [activity, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ title, date, description });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Activity" : "New Activity"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the activity details below."
              : "Fill in the details to create a new activity."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex-1 space-y-4 px-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Activity title"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Jan 2026"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the activity"
                required
              />
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <IconLoader2 className="size-3.5 animate-spin" />}
              {isEdit ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
