"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Skills } from "@repo/ui/components/skills";
import { Button } from "@repo/ui/components/ui/button";
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ImageUploadField } from "@/components/image-upload-field";
import { apiClient } from "@/lib/api-client";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  icon_url: z.string().min(1, "Icon is required"),
});

type FormValues = z.infer<typeof schema>;

interface SkillsFormProps {
  id?: string;
}

export function SkillsForm({ id }: SkillsFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const {
    data: existing,
    isLoading: isLoadingExisting,
    isError,
  } = useQuery({
    queryKey: ["skills", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const r = await apiClient.GET("/skills/{id}", {
        params: { path: { id } },
      });
      return r.data;
    },
    enabled: isEdit,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", icon_url: "" },
    values: existing
      ? { name: existing.name, icon_url: existing.icon_url }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (id) {
        return apiClient.PUT("/skills/{id}", {
          params: { path: { id } },
          body: values,
        });
      }
      return apiClient.POST("/skills", {
        body: values,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success(isEdit ? "Skill updated" : "Skill created");
      router.push("/skills");
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
        <p className="text-destructive">Failed to load skill.</p>
        <Button variant="outline" onClick={() => router.push("/skills")}>
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
          {isEdit ? "Edit Skill" : "New Skill"}
        </h2>

        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input {...form.register("name")} />
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Icon</FieldLabel>
          <Controller
            control={form.control}
            name="icon_url"
            render={({ field }) => (
              <ImageUploadField value={field.value} onChange={field.onChange} />
            )}
          />
          <FieldError>{form.formState.errors.icon_url?.message}</FieldError>
        </Field>

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Spinner />}
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/skills")}
          >
            Cancel
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Skills
          skills={[
            {
              id: id ?? "preview",
              name: watched.name || "Skill Name",
              icon_url: watched.icon_url || "",
            },
          ]}
        />
      </div>
    </div>
  );
}
