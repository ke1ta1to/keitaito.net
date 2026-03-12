"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Articles } from "@repo/ui/components/articles";
import { Button } from "@repo/ui/components/ui/button";
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { apiClient } from "@/lib/api-client";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Valid URL is required"),
  liked_count: z.number().int().min(0),
  published_at: z.string().min(1, "Published date is required"),
  source: z.enum(["zenn", "qiita"]).optional(),
});

type FormValues = z.infer<typeof schema>;

interface ArticlesFormProps {
  id?: string;
}

export function ArticlesForm({ id }: ArticlesFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const {
    data: existing,
    isLoading: isLoadingExisting,
    isError,
  } = useQuery({
    queryKey: ["articles", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const r = await apiClient.GET("/articles/{id}", {
        params: { path: { id } },
      });
      return r.data;
    },
    enabled: isEdit,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      url: "",
      liked_count: 0,
      published_at: "",
      source: undefined,
    },
    values: existing
      ? {
          title: existing.title,
          url: existing.url,
          liked_count: existing.liked_count,
          published_at: existing.published_at,
          source: existing.source ?? undefined,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const body = {
        ...values,
        source: values.source || undefined,
      };
      if (id) {
        return apiClient.PUT("/articles/{id}", {
          params: { path: { id } },
          body: body,
        });
      }
      return apiClient.POST("/articles", {
        body: body,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(isEdit ? "Article updated" : "Article created");
      router.push("/articles");
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
        <p className="text-destructive">Failed to load article.</p>
        <Button variant="outline" onClick={() => router.push("/articles")}>
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
          {isEdit ? "Edit Article" : "New Article"}
        </h2>

        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input {...form.register("title")} />
          <FieldError>{form.formState.errors.title?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>URL</FieldLabel>
          <Input type="url" {...form.register("url")} />
          <FieldError>{form.formState.errors.url?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Liked Count</FieldLabel>
          <Input
            type="number"
            {...form.register("liked_count", { valueAsNumber: true })}
          />
          <FieldError>{form.formState.errors.liked_count?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Published At</FieldLabel>
          <Input type="date" {...form.register("published_at")} />
          <FieldError>{form.formState.errors.published_at?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Source</FieldLabel>
          <Controller
            control={form.control}
            name="source"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zenn">Zenn</SelectItem>
                  <SelectItem value="qiita">Qiita</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{form.formState.errors.source?.message}</FieldError>
        </Field>

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Spinner />}
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/articles")}
          >
            Cancel
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Articles
          articles={[
            {
              title: watched.title || "Title",
              url: watched.url || "#",
              liked_count: watched.liked_count || 0,
              published_at: watched.published_at || "Date",
              source: watched.source ?? null,
            },
          ]}
        />
      </div>
    </div>
  );
}
