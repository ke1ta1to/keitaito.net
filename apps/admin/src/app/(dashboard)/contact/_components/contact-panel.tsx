"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Contact } from "@repo/ui/components/contact";
import { Button } from "@repo/ui/components/ui/button";
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PreviewLayout } from "@/components/preview-layout";
import { apiClient } from "@/lib/api-client";

const schema = z.object({
  email: z.email("Valid email is required"),
  twitter: z.string().min(1, "Twitter is required"),
});

type FormValues = z.infer<typeof schema>;

export function ContactPanel() {
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: contact,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contact"],
    queryFn: () => apiClient.GET("/contact").then((r) => r.data),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", twitter: "" },
    values: contact
      ? { email: contact.email, twitter: contact.twitter }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiClient.PUT("/contact", {
        body: values,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["contact"] });
      toast.success("Contact updated");
      setEditing(false);
    },
    onError: () => toast.error("Failed to update contact"),
  });

  const watched = useWatch({ control: form.control });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p className="text-destructive">Failed to load contact.</p>;
  }

  const previewData = {
    email: watched.email ?? "",
    twitter: watched.twitter ?? "",
  };

  return (
    <PreviewLayout preview={<Contact contact={previewData} />}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Contact</h2>
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
              <FieldLabel>Email</FieldLabel>
              <Input type="email" {...form.register("email")} />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Twitter</FieldLabel>
              <Input {...form.register("twitter")} />
              <FieldError>{form.formState.errors.twitter?.message}</FieldError>
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
                  if (contact) form.reset(contact);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="text-sm">
            {contact &&
              (
                [
                  { label: "Email", value: contact.email },
                  { label: "Twitter", value: contact.twitter },
                ] as const
              ).map(({ label, value }) => (
                <div key={label} className="flex gap-2 border-b py-2">
                  <dt className="text-muted-foreground w-24 shrink-0">
                    {label}
                  </dt>
                  <dd className="truncate">{value}</dd>
                </div>
              ))}
          </dl>
        )}
      </div>
    </PreviewLayout>
  );
}
