"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type React from "react";

import { ImageUploadField } from "./image-upload-field";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "image";
  options?: { label: string; value: string }[];
  required?: boolean;
}

interface CrudResourcePanelProps<T extends { id: string }> {
  title: string;
  queryKey: string;
  listFn: () => Promise<T[] | undefined>;
  createFn: (body: Record<string, unknown>) => Promise<unknown>;
  updateFn: (id: string, body: Record<string, unknown>) => Promise<unknown>;
  deleteFn: (id: string) => Promise<unknown>;
  fields: FieldDef[];
  renderCell?: (item: T, key: string) => React.ReactNode;
}

type DialogMode = "closed" | "create" | "edit" | "delete";

function buildInitialForm(fields: FieldDef[]): Record<string, string> {
  const form: Record<string, string> = {};
  for (const field of fields) {
    form[field.key] = "";
  }
  return form;
}

function buildFormBody(
  fields: FieldDef[],
  form: Record<string, string>,
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const field of fields) {
    const value = form[field.key] ?? "";
    if (field.type === "number") {
      body[field.key] = value === "" ? undefined : Number(value);
    } else if (field.type === "select" || field.type === "image") {
      body[field.key] = value === "" ? undefined : value;
    } else {
      body[field.key] = value;
    }
  }
  return body;
}

export function CrudResourcePanel<T extends { id: string }>({
  title,
  queryKey,
  listFn,
  createFn,
  updateFn,
  deleteFn,
  fields,
  renderCell,
}: CrudResourcePanelProps<T>) {
  const queryClient = useQueryClient();
  const [dialogMode, setDialogMode] = useState<DialogMode>("closed");
  const [form, setForm] = useState<Record<string, string>>(
    buildInitialForm(fields),
  );
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: listFn,
  });

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => createFn(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDialogMode("closed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      updateFn(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDialogMode("closed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDialogMode("closed");
    },
  });

  function openCreate() {
    setForm(buildInitialForm(fields));
    setSelectedItem(null);
    setDialogMode("create");
  }

  function openEdit(item: T) {
    const newForm: Record<string, string> = {};
    for (const field of fields) {
      const value = (item as Record<string, unknown>)[field.key];
      newForm[field.key] = value == null ? "" : String(value);
    }
    setForm(newForm);
    setSelectedItem(item);
    setDialogMode("edit");
  }

  function openDelete(item: T) {
    setSelectedItem(item);
    setDialogMode("delete");
  }

  function handleSubmit() {
    const body = buildFormBody(fields, form);
    if (dialogMode === "create") {
      createMutation.mutate(body);
    } else if (dialogMode === "edit" && selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, body });
    }
  }

  function handleDelete() {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
    }
  }

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardAction>
          <Button size="sm" onClick={openCreate}>
            <IconPlus />
            Create
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                {fields.map((field) => (
                  <TableHead key={field.key}>{field.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-muted-foreground font-mono">
                      {item.id.slice(0, 8)}...
                    </TableCell>
                    {fields.map((field) => {
                      const cellValue = (item as Record<string, unknown>)[
                        field.key
                      ];
                      return (
                        <TableCell key={field.key}>
                          {renderCell ? (
                            (renderCell(item, field.key) ??
                            String(cellValue ?? ""))
                          ) : field.type === "image" && cellValue ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={String(cellValue)}
                              alt={field.label}
                              className="h-8 w-8 rounded object-cover"
                            />
                          ) : (
                            String(cellValue ?? "")
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(item)}
                        >
                          <IconPencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openDelete(item)}
                        >
                          <IconTrash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={fields.length + 2}
                    className="text-muted-foreground text-center"
                  >
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogMode === "create" || dialogMode === "edit"}
        onOpenChange={(open) => {
          if (!open) setDialogMode("closed");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? `Create ${title}` : `Edit ${title}`}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? `Add a new ${title.toLowerCase()} entry.`
                : `Update the ${title.toLowerCase()} entry.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            {fields.map((field) => (
              <div key={field.key} className="grid gap-1.5">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "image" ? (
                  <ImageUploadField
                    value={form[field.key] ?? ""}
                    onChange={(url) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: url,
                      }))
                    }
                  />
                ) : field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    value={form[field.key] ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                ) : field.type === "select" && field.options ? (
                  <Select
                    value={form[field.key] ?? ""}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: value === "__empty__" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty__">(none)</SelectItem>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.key}
                    type={field.type === "number" ? "number" : "text"}
                    value={form[field.key] ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogMode("closed")}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating}>
              {dialogMode === "create" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogMode === "delete"}
        onOpenChange={(open) => {
          if (!open) setDialogMode("closed");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {title}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entry? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogMode("closed")}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isMutating}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
