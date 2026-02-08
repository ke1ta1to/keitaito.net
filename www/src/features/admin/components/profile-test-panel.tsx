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

const updateProfileSchema = z.object({
  name: z.string().min(1),
  birthday: z.string().min(1),
  location: z.string().min(1),
  school: z.string().min(1),
  image_url: z.string().url(),
  x: z.string().url(),
  github: z.string().url(),
  zenn: z.string().url(),
  qiita: z.string().url(),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export function ProfileTestPanel() {
  const updateForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      birthday: "",
      location: "",
      school: "",
      image_url: "",
      x: "",
      github: "",
      zenn: "",
      qiita: "",
    },
  });

  const getQuery = useQuery({
    queryKey: [ApiPaths.profile_get],
    queryFn: () => apiClient.GET("/profile"),
    enabled: false,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileFormData) =>
      apiClient.PUT("/profile", {
        body: {
          name: data.name,
          birthday: data.birthday,
          location: data.location,
          school: data.school,
          image_url: data.image_url,
          x: data.x,
          github: data.github,
          zenn: data.zenn,
          qiita: data.qiita,
        },
      }),
  });

  const handleUpdateProfile = (data: UpdateProfileFormData) => {
    updateMutation.mutate(data, { onSuccess: () => updateForm.reset() });
  };

  return (
    <TestPanelLayout title="Profile API Test Panel">
      {/* GET /profile */}
      <EndpointButton
        label="GET /profile"
        onClick={() => getQuery.refetch()}
        isLoading={getQuery.isFetching}
        isError={getQuery.isError}
        data={getQuery.data}
        error={getQuery.error}
      />

      {/* PUT /profile */}
      <EndpointForm
        form={updateForm}
        onSubmit={handleUpdateProfile}
        label="PUT /profile"
        isLoading={updateMutation.isPending}
        isError={updateMutation.isError}
        data={updateMutation.data}
        error={updateMutation.error}
        formClassName="space-y-2"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <SimpleFormField control={updateForm.control} name="name" placeholder="Name" />
          <SimpleFormField control={updateForm.control} name="birthday" placeholder="Birthday" maxWidth="max-w-40" type="date" />
          <SimpleFormField control={updateForm.control} name="location" placeholder="Location" maxWidth="max-w-40" />
          <SimpleFormField control={updateForm.control} name="school" placeholder="School" />
          <SimpleFormField control={updateForm.control} name="image_url" placeholder="Image URL" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SimpleFormField control={updateForm.control} name="x" placeholder="X URL" />
          <SimpleFormField control={updateForm.control} name="github" placeholder="GitHub URL" />
          <SimpleFormField control={updateForm.control} name="zenn" placeholder="Zenn URL" />
          <SimpleFormField control={updateForm.control} name="qiita" placeholder="Qiita URL" />
        </div>
      </EndpointForm>
    </TestPanelLayout>
  );
}
