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
  workId: z.string().min(1),
});

const createWorkSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  thumbnail: z.string().min(1),
});

const updateWorkSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  thumbnail: z.string().min(1),
});

const deleteWorkSchema = z.object({
  id: z.string().min(1),
});

type GetByIdFormData = z.infer<typeof getByIdSchema>;
type CreateWorkFormData = z.infer<typeof createWorkSchema>;
type UpdateWorkFormData = z.infer<typeof updateWorkSchema>;
type DeleteWorkFormData = z.infer<typeof deleteWorkSchema>;

export function WorksTestPanel() {
  const [getByIdTarget, setGetByIdTarget] = useState("");

  const getByIdForm = useForm<GetByIdFormData>({
    resolver: zodResolver(getByIdSchema),
    defaultValues: { workId: "" },
  });

  const createForm = useForm<CreateWorkFormData>({
    resolver: zodResolver(createWorkSchema),
    defaultValues: { title: "", slug: "", content: "", thumbnail: "" },
  });

  const updateForm = useForm<UpdateWorkFormData>({
    resolver: zodResolver(updateWorkSchema),
    defaultValues: { id: "", title: "", slug: "", content: "", thumbnail: "" },
  });

  const deleteForm = useForm<DeleteWorkFormData>({
    resolver: zodResolver(deleteWorkSchema),
    defaultValues: { id: "" },
  });

  const listQuery = useQuery({
    queryKey: [ApiPaths.works_list],
    queryFn: () => apiClient.GET("/works"),
    enabled: false,
  });

  const getQuery = useQuery({
    queryKey: [ApiPaths.works_get, getByIdTarget],
    queryFn: () =>
      apiClient.GET("/works/{id}", {
        params: { path: { id: getByIdTarget } },
      }),
    enabled: !!getByIdTarget,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateWorkFormData) =>
      apiClient.POST("/works", {
        body: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          thumbnail: data.thumbnail,
        },
      }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateWorkFormData) =>
      apiClient.PUT("/works/{id}", {
        params: { path: { id: data.id } },
        body: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          thumbnail: data.thumbnail,
        },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (data: DeleteWorkFormData) =>
      apiClient.DELETE("/works/{id}", {
        params: { path: { id: data.id } },
      }),
  });

  const handleGetWorkById = (data: GetByIdFormData) => {
    setGetByIdTarget(data.workId);
  };

  const handleCreateWork = (data: CreateWorkFormData) => {
    createMutation.mutate(data, { onSuccess: () => createForm.reset() });
  };

  const handleUpdateWork = (data: UpdateWorkFormData) => {
    updateMutation.mutate(data, { onSuccess: () => updateForm.reset() });
  };

  const handleDeleteWork = (data: DeleteWorkFormData) => {
    deleteMutation.mutate(data, { onSuccess: () => deleteForm.reset() });
  };

  return (
    <TestPanelLayout title="Works API Test Panel">
      {/* GET /works */}
      <EndpointButton
        label="GET /works"
        onClick={() => listQuery.refetch()}
        isLoading={listQuery.isFetching}
        isError={listQuery.isError}
        data={listQuery.data}
        error={listQuery.error}
      />

      {/* GET /works/{id} */}
      <EndpointForm
        form={getByIdForm}
        onSubmit={handleGetWorkById}
        label="GET /works/{id}"
        isLoading={getQuery.isFetching}
        isError={getQuery.isError}
        data={getQuery.data}
        error={getQuery.error}
      >
        <SimpleFormField control={getByIdForm.control} name="workId" placeholder="Work ID" />
      </EndpointForm>

      {/* POST /works */}
      <EndpointForm
        form={createForm}
        onSubmit={handleCreateWork}
        label="POST /works"
        isLoading={createMutation.isPending}
        isError={createMutation.isError}
        data={createMutation.data}
        error={createMutation.error}
        formClassName="flex items-center gap-2 flex-wrap"
      >
        <SimpleFormField control={createForm.control} name="title" placeholder="Title" maxWidth="max-w-30" />
        <SimpleFormField control={createForm.control} name="slug" placeholder="Slug" maxWidth="max-w-35" />
        <SimpleFormField control={createForm.control} name="content" placeholder="Content" maxWidth="max-w-40" />
        <SimpleFormField control={createForm.control} name="thumbnail" placeholder="Thumbnail URL" />
      </EndpointForm>

      {/* PUT /works/{id} */}
      <EndpointForm
        form={updateForm}
        onSubmit={handleUpdateWork}
        label="PUT /works/{id}"
        isLoading={updateMutation.isPending}
        isError={updateMutation.isError}
        data={updateMutation.data}
        error={updateMutation.error}
        formClassName="flex items-center gap-2 flex-wrap"
      >
        <SimpleFormField control={updateForm.control} name="id" placeholder="ID" />
        <SimpleFormField control={updateForm.control} name="title" placeholder="Title" maxWidth="max-w-30" />
        <SimpleFormField control={updateForm.control} name="slug" placeholder="Slug" maxWidth="max-w-35" />
        <SimpleFormField control={updateForm.control} name="content" placeholder="Content" maxWidth="max-w-40" />
        <SimpleFormField control={updateForm.control} name="thumbnail" placeholder="Thumbnail URL" />
      </EndpointForm>

      {/* DELETE /works/{id} */}
      <EndpointForm
        form={deleteForm}
        onSubmit={handleDeleteWork}
        label="DELETE /works/{id}"
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
