"use client";

import type { components } from "@repo/api-client/schema";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { IconPencil } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { apiClient } from "./api-client";

type Contact = components["schemas"]["Contact"];

export function ContactPanel() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: "", twitter: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["contact"],
    queryFn: () => apiClient.GET("/contact").then((res) => res.data ?? null),
  });

  const updateMutation = useMutation({
    mutationFn: (body: components["schemas"]["ContactUpdateRequest"]) =>
      apiClient.PUT("/contact", { body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["contact"] });
      setEditing(false);
    },
  });

  function startEdit(contact: Contact) {
    setForm({ email: contact.email, twitter: contact.twitter });
    setEditing(true);
  }

  function handleSave() {
    updateMutation.mutate(form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
        {!editing && (
          <CardAction>
            <Button
              size="sm"
              variant="outline"
              onClick={() => (data ? startEdit(data) : setEditing(true))}
            >
              <IconPencil />
              {data ? "Edit" : "Create"}
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-48" />
          </div>
        ) : editing ? (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="contact-twitter">Twitter</Label>
              <Input
                id="contact-twitter"
                value={form.twitter}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, twitter: e.target.value }))
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                Save
              </Button>
            </div>
          </div>
        ) : data ? (
          <dl className="grid gap-2">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd>{data.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Twitter</dt>
              <dd>{data.twitter}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Updated At</dt>
              <dd className="text-muted-foreground">{data.updated_at}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-muted-foreground">No data</p>
        )}
      </CardContent>
    </Card>
  );
}
