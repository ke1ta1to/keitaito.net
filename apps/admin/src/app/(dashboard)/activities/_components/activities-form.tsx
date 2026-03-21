"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activities } from "@repo/ui/components/activities";
import { Button } from "@repo/ui/components/ui/button";
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { apiClient } from "@/lib/api-client";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof schema>;

interface ActivitiesFormProps {
  id?: string;
}

export function ActivitiesForm({ id }: ActivitiesFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const {
    data: existing,
    isLoading: isLoadingExisting,
    isError,
  } = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const r = await apiClient.GET("/activities/{id}", {
        params: { path: { id } },
      });
      return r.data;
    },
    enabled: isEdit,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", date: "", description: "" },
    values: existing
      ? {
          title: existing.title,
          date: existing.date,
          description: existing.description,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (id) {
        return apiClient.PUT("/activities/{id}", {
          params: { path: { id } },
          body: values,
        });
      }
      return apiClient.POST("/activities", {
        body: values,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success(isEdit ? "Activity updated" : "Activity created");
      router.push("/activities");
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
        <p className="text-destructive">Failed to load activity.</p>
        <Button variant="outline" onClick={() => router.push("/activities")}>
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
          {isEdit ? "Edit Activity" : "New Activity"}
        </h2>

        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input {...form.register("title")} />
          <FieldError>{form.formState.errors.title?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Date</FieldLabel>
          <Input type="month" {...form.register("date")} />
          <FieldError>{form.formState.errors.date?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input {...form.register("description")} />
          <FieldError>{form.formState.errors.description?.message}</FieldError>
        </Field>

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Spinner />}
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/activities")}
          >
            Cancel
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Activities
          activities={[
            {
              id: id ?? "preview",
              title: watched.title || "Title",
              date: watched.date || "Date",
              description: watched.description || "Description",
            },
          ]}
        />
      </div>
    </div>
  );
}
