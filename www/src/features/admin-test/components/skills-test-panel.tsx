"use client";

import { apiClient } from "@/lib/api-client";
import { ApiPaths } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EndpointButton } from "./endpoint-button";
import { EndpointForm } from "./endpoint-form";
import { SimpleFormField } from "./simple-form-field";
import { TestPanelLayout } from "./test-panel-layout";

const getByIdSchema = z.object({
  skillId: z.string().min(1),
});

const createSkillSchema = z.object({
  name: z.string().min(1),
  icon_url: z.string().min(1),
});

const updateSkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon_url: z.string().min(1),
});

const deleteSkillSchema = z.object({
  id: z.string().min(1),
});

type GetByIdFormData = z.infer<typeof getByIdSchema>;
type CreateSkillFormData = z.infer<typeof createSkillSchema>;
type UpdateSkillFormData = z.infer<typeof updateSkillSchema>;
type DeleteSkillFormData = z.infer<typeof deleteSkillSchema>;

export function SkillsTestPanel() {
  const [getByIdTarget, setGetByIdTarget] = useState("");

  const getByIdForm = useForm<GetByIdFormData>({
    resolver: zodResolver(getByIdSchema),
    defaultValues: { skillId: "" },
  });

  const createForm = useForm<CreateSkillFormData>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: { name: "", icon_url: "" },
  });

  const updateForm = useForm<UpdateSkillFormData>({
    resolver: zodResolver(updateSkillSchema),
    defaultValues: { id: "", name: "", icon_url: "" },
  });

  const deleteForm = useForm<DeleteSkillFormData>({
    resolver: zodResolver(deleteSkillSchema),
    defaultValues: { id: "" },
  });

  const listQuery = useQuery({
    queryKey: [ApiPaths.skills_list],
    queryFn: () => apiClient.GET("/skills"),
    enabled: false,
  });

  const getQuery = useQuery({
    queryKey: [ApiPaths.skills_get, getByIdTarget],
    queryFn: () =>
      apiClient.GET("/skills/{id}", {
        params: { path: { id: getByIdTarget } },
      }),
    enabled: !!getByIdTarget,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSkillFormData) =>
      apiClient.POST("/skills", {
        body: { name: data.name, icon_url: data.icon_url },
      }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSkillFormData) =>
      apiClient.PUT("/skills/{id}", {
        params: { path: { id: data.id } },
        body: { name: data.name, icon_url: data.icon_url },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (data: DeleteSkillFormData) =>
      apiClient.DELETE("/skills/{id}", {
        params: { path: { id: data.id } },
      }),
  });

  const handleGetSkillById = (data: GetByIdFormData) => {
    setGetByIdTarget(data.skillId);
  };

  const handleCreateSkill = (data: CreateSkillFormData) => {
    createMutation.mutate(data, { onSuccess: () => createForm.reset() });
  };

  const handleUpdateSkill = (data: UpdateSkillFormData) => {
    updateMutation.mutate(data, { onSuccess: () => updateForm.reset() });
  };

  const handleDeleteSkill = (data: DeleteSkillFormData) => {
    deleteMutation.mutate(data, { onSuccess: () => deleteForm.reset() });
  };

  return (
    <TestPanelLayout title="Skills API Test Panel">
      {/* GET /skills */}
      <EndpointButton
        label="GET /skills"
        onClick={() => listQuery.refetch()}
        isLoading={listQuery.isFetching}
        isError={listQuery.isError}
        data={listQuery.data}
        error={listQuery.error}
      />

      {/* GET /skills/{id} */}
      <EndpointForm
        form={getByIdForm}
        onSubmit={handleGetSkillById}
        label="GET /skills/{id}"
        isLoading={getQuery.isFetching}
        isError={getQuery.isError}
        data={getQuery.data}
        error={getQuery.error}
      >
        <SimpleFormField control={getByIdForm.control} name="skillId" placeholder="Skill ID" />
      </EndpointForm>

      {/* POST /skills */}
      <EndpointForm
        form={createForm}
        onSubmit={handleCreateSkill}
        label="POST /skills"
        isLoading={createMutation.isPending}
        isError={createMutation.isError}
        data={createMutation.data}
        error={createMutation.error}
        formClassName="flex items-center gap-2 flex-wrap"
      >
        <SimpleFormField control={createForm.control} name="name" placeholder="Name" maxWidth="max-w-30" />
        <SimpleFormField control={createForm.control} name="icon_url" placeholder="Icon URL" />
      </EndpointForm>

      {/* PUT /skills/{id} */}
      <EndpointForm
        form={updateForm}
        onSubmit={handleUpdateSkill}
        label="PUT /skills/{id}"
        isLoading={updateMutation.isPending}
        isError={updateMutation.isError}
        data={updateMutation.data}
        error={updateMutation.error}
        formClassName="flex items-center gap-2 flex-wrap"
      >
        <SimpleFormField control={updateForm.control} name="id" placeholder="ID" />
        <SimpleFormField control={updateForm.control} name="name" placeholder="Name" maxWidth="max-w-30" />
        <SimpleFormField control={updateForm.control} name="icon_url" placeholder="Icon URL" />
      </EndpointForm>

      {/* DELETE /skills/{id} */}
      <EndpointForm
        form={deleteForm}
        onSubmit={handleDeleteSkill}
        label="DELETE /skills/{id}"
        isLoading={deleteMutation.isPending}
        isError={deleteMutation.isError}
        data={null}
        error={deleteMutation.error}
        successData={
          deleteMutation.isSuccess
            ? { message: "Deleted successfully" }
            : null
        }
      >
        <SimpleFormField control={deleteForm.control} name="id" placeholder="ID" />
      </EndpointForm>
    </TestPanelLayout>
  );
}
