"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/ui/button";
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { WorkCard, Works } from "@repo/ui/components/works";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ImageUploadField } from "@/components/image-upload-field";
import { apiClient } from "@/lib/api-client";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail_url: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface WorksFormProps {
  id?: string;
}

export function WorksForm({ id }: WorksFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const {
    data: existing,
    isLoading: isLoadingExisting,
    isError,
  } = useQuery({
    queryKey: ["works", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const r = await apiClient.GET("/works/{id}", {
        params: { path: { id } },
      });
      return r.data;
    },
    enabled: isEdit,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", slug: "", content: "", thumbnail_url: "" },
    values: existing
      ? {
          title: existing.title,
          slug: existing.slug,
          content: existing.content,
          thumbnail_url: existing.thumbnail_url ?? "",
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const body = {
        ...values,
        thumbnail_url: values.thumbnail_url || undefined,
      };
      if (id) {
        return apiClient.PUT("/works/{id}", {
          params: { path: { id } },
          body: body,
        });
      }
      return apiClient.POST("/works", {
        body: body,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["works"] });
      toast.success(isEdit ? "Work updated" : "Work created");
      router.push("/works");
    },
    onError: () =>
      toast.error(isEdit ? "Failed to update" : "Failed to create"),
  });

  const watched = useWatch({ control: form.control });

  if (isEdit && isLoadingExisting) {
    return <Spinner />;
  }

  if (isEdit && isError) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">Failed to load work.</p>
        <Button variant="outline" onClick={() => router.push("/works")}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Work" : "New Work"}
        </h2>

        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input {...form.register("title")} />
          <FieldError>{form.formState.errors.title?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Slug</FieldLabel>
          <Input {...form.register("slug")} />
          <FieldError>{form.formState.errors.slug?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Content</FieldLabel>
          <Textarea rows={8} {...form.register("content")} />
          <FieldError>{form.formState.errors.content?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Thumbnail</FieldLabel>
          <Controller
            control={form.control}
            name="thumbnail_url"
            render={({ field }) => (
              <ImageUploadField
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
          <FieldError>
            {form.formState.errors.thumbnail_url?.message}
          </FieldError>
        </Field>

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Spinner />}
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/works")}
          >
            Cancel
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Works>
          <WorkCard
            title={watched.title || "Title"}
            thumbnailUrl={watched.thumbnail_url || null}
          />
        </Works>
      </div>
    </div>
  );
}
