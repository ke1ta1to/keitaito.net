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

type Profile = components["schemas"]["Profile"];
type ProfileUpdateRequest = components["schemas"]["ProfileUpdateRequest"];

const profileFields = [
  { key: "name", label: "Name" },
  { key: "birthday", label: "Birthday" },
  { key: "location", label: "Location" },
  { key: "school", label: "School" },
  { key: "image_url", label: "Image URL" },
  { key: "twitter", label: "Twitter" },
  { key: "github", label: "GitHub" },
  { key: "zenn", label: "Zenn" },
  { key: "qiita", label: "Qiita" },
] as const;

function buildForm(profile: Profile): ProfileUpdateRequest {
  return {
    name: profile.name,
    birthday: profile.birthday,
    location: profile.location,
    school: profile.school,
    image_url: profile.image_url,
    twitter: profile.twitter,
    github: profile.github,
    zenn: profile.zenn,
    qiita: profile.qiita,
  };
}

export function ProfilePanel() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileUpdateRequest>({
    name: "",
    birthday: "",
    location: "",
    school: "",
    image_url: "",
    twitter: "",
    github: "",
    zenn: "",
    qiita: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.GET("/profile").then((res) => res.data ?? null),
  });

  const updateMutation = useMutation({
    mutationFn: (body: ProfileUpdateRequest) =>
      apiClient.PUT("/profile", { body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      setEditing(false);
    },
  });

  function startEdit(profile: Profile) {
    setForm(buildForm(profile));
    setEditing(true);
  }

  function handleSave() {
    updateMutation.mutate(form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
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
            {profileFields.map((field) => (
              <Skeleton key={field.key} className="h-6 w-48" />
            ))}
          </div>
        ) : editing ? (
          <div className="grid gap-3">
            {profileFields.map((field) => (
              <div key={field.key} className="grid gap-1.5">
                <Label htmlFor={`profile-${field.key}`}>{field.label}</Label>
                <Input
                  id={`profile-${field.key}`}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
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
            {profileFields.map((field) => (
              <div key={field.key}>
                <dt className="text-muted-foreground">{field.label}</dt>
                <dd>{data[field.key]}</dd>
              </div>
            ))}
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
