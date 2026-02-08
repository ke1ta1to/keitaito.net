"use client";

import { apiClient } from "@/lib/api-client";
import { ApiPaths } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EndpointButton } from "./endpoint-button";
import { EndpointForm } from "./endpoint-form";
import { SimpleFormField } from "./simple-form-field";
import { TestPanelLayout } from "./test-panel-layout";

const updateContactSchema = z.object({
  email: z.string().email(),
  x: z.string().min(1),
});

type UpdateContactFormData = z.infer<typeof updateContactSchema>;

export function ContactTestPanel() {
  const updateForm = useForm<UpdateContactFormData>({
    resolver: zodResolver(updateContactSchema),
    defaultValues: {
      email: "",
      x: "",
    },
  });

  const getQuery = useQuery({
    queryKey: [ApiPaths.contact_get],
    queryFn: () => apiClient.GET("/contact"),
    enabled: false,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateContactFormData) =>
      apiClient.PUT("/contact", {
        body: { email: data.email, x: data.x },
      }),
  });

  const handleUpdateContact = (data: UpdateContactFormData) => {
    updateMutation.mutate(data, { onSuccess: () => updateForm.reset() });
  };

  return (
    <TestPanelLayout title="Contact API Test Panel">
      {/* GET /contact */}
      <EndpointButton
        label="GET /contact"
        onClick={() => getQuery.refetch()}
        isLoading={getQuery.isFetching}
        isError={getQuery.isError}
        data={getQuery.data}
        error={getQuery.error}
      />

      {/* PUT /contact */}
      <EndpointForm
        form={updateForm}
        onSubmit={handleUpdateContact}
        label="PUT /contact"
        isLoading={updateMutation.isPending}
        isError={updateMutation.isError}
        data={updateMutation.data}
        error={updateMutation.error}
        formClassName="space-y-2"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <SimpleFormField control={updateForm.control} name="email" placeholder="Email" />
          <SimpleFormField control={updateForm.control} name="x" placeholder="X Username" />
        </div>
      </EndpointForm>
    </TestPanelLayout>
  );
}
