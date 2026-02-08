"use client";

import { apiClient } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EndpointForm } from "./endpoint-form";
import { SimpleFormField } from "./simple-form-field";
import { TestPanelLayout } from "./test-panel-layout";

const presignSchema = z.object({
  filename: z.string().min(1),
  content_type: z.string().min(1),
});

type PresignFormData = z.infer<typeof presignSchema>;

export function UploadsTestPanel() {
  const presignForm = useForm<PresignFormData>({
    resolver: zodResolver(presignSchema),
    defaultValues: { filename: "", content_type: "" },
  });

  const presignMutation = useMutation({
    mutationFn: (data: PresignFormData) =>
      apiClient.POST("/uploads/presign", {
        body: { filename: data.filename, content_type: data.content_type },
      }),
  });

  const handlePresign = (data: PresignFormData) => {
    presignMutation.mutate(data, { onSuccess: () => presignForm.reset() });
  };

  return (
    <TestPanelLayout title="Uploads API Test Panel">
      {/* POST /uploads/presign */}
      <EndpointForm
        form={presignForm}
        onSubmit={handlePresign}
        label="POST /uploads/presign"
        isLoading={presignMutation.isPending}
        isError={presignMutation.isError}
        data={presignMutation.data}
        error={presignMutation.error}
        formClassName="flex items-center gap-2 flex-wrap"
      >
        <SimpleFormField control={presignForm.control} name="filename" placeholder="Filename" maxWidth="max-w-40" />
        <SimpleFormField control={presignForm.control} name="content_type" placeholder="Content-Type" maxWidth="max-w-40" />
      </EndpointForm>
    </TestPanelLayout>
  );
}
