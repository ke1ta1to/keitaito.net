"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@repo/ui/components/profile";
import { Button } from "@repo/ui/components/ui/button";
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ImageUploadField } from "@/components/image-upload-field";
import { PreviewLayout } from "@/components/preview-layout";
import { apiClient } from "@/lib/api-client";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  birthday: z.string().min(1, "Birthday is required"),
  location: z.string().min(1, "Location is required"),
  school: z.string().min(1, "School is required"),
  image_url: z.string().min(1, "Image is required"),
  twitter: z.string().min(1, "Twitter is required"),
  github: z.string().min(1, "GitHub is required"),
  zenn: z.string().min(1, "Zenn is required"),
  qiita: z.string().min(1, "Qiita is required"),
});

type FormValues = z.infer<typeof schema>;

export function ProfilePanel() {
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.GET("/profile").then((r) => r.data),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      birthday: "",
      location: "",
      school: "",
      image_url: "",
      twitter: "",
      github: "",
      zenn: "",
      qiita: "",
    },
    values: profile
      ? {
          name: profile.name,
          birthday: profile.birthday,
          location: profile.location,
          school: profile.school,
          image_url: profile.image_url,
          twitter: profile.twitter,
          github: profile.github,
          zenn: profile.zenn,
          qiita: profile.qiita,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiClient.PUT("/profile", {
        body: values,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
      setEditing(false);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const watched = useWatch({ control: form.control });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p className="text-destructive">Failed to load profile.</p>;
  }

  const previewData = {
    name: watched.name ?? "",
    birthday: watched.birthday ?? "",
    location: watched.location ?? "",
    school: watched.school ?? "",
    image_url: watched.image_url ?? "",
    twitter: watched.twitter ?? "",
    github: watched.github ?? "",
    zenn: watched.zenn ?? "",
    qiita: watched.qiita ?? "",
  };

  return (
    <PreviewLayout preview={<Profile profile={previewData} />}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Profile</h2>
          {!editing && (
            <Button size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...form.register("name")} />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Birthday</FieldLabel>
              <Input type="date" {...form.register("birthday")} />
              <FieldError>{form.formState.errors.birthday?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Location</FieldLabel>
              <Input {...form.register("location")} />
              <FieldError>{form.formState.errors.location?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>School</FieldLabel>
              <Input {...form.register("school")} />
              <FieldError>{form.formState.errors.school?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Image</FieldLabel>
              <Controller
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <ImageUploadField
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError>
                {form.formState.errors.image_url?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>Twitter</FieldLabel>
              <Input {...form.register("twitter")} />
              <FieldError>{form.formState.errors.twitter?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>GitHub</FieldLabel>
              <Input {...form.register("github")} />
              <FieldError>{form.formState.errors.github?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Zenn</FieldLabel>
              <Input {...form.register("zenn")} />
              <FieldError>{form.formState.errors.zenn?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Qiita</FieldLabel>
              <Input {...form.register("qiita")} />
              <FieldError>{form.formState.errors.qiita?.message}</FieldError>
            </Field>

            <div className="flex gap-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Spinner />}
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  if (profile) form.reset(profile);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="text-sm">
            {profile &&
              (
                [
                  { label: "Name", value: profile.name },
                  { label: "Birthday", value: profile.birthday },
                  { label: "Location", value: profile.location },
                  { label: "School", value: profile.school },
                  { label: "Image", value: profile.image_url, type: "image" },
                  { label: "Twitter", value: profile.twitter, type: "url" },
                  { label: "GitHub", value: profile.github, type: "url" },
                  { label: "Zenn", value: profile.zenn, type: "url" },
                  { label: "Qiita", value: profile.qiita, type: "url" },
                ] as const
              ).map(({ label, value, ...rest }) => (
                <div key={label} className="flex gap-2 border-b py-2">
                  <dt className="text-muted-foreground w-24 shrink-0">
                    {label}
                  </dt>
                  <dd className="truncate">
                    {"type" in rest && rest.type === "image" ? (
                      value ? (
                        <Image
                          src={value}
                          alt=""
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        "—"
                      )
                    ) : "type" in rest && rest.type === "url" ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
          </dl>
        )}
      </div>
    </PreviewLayout>
  );
}
