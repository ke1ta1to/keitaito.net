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
  activityId: z.string().min(1),
});

const createActivitySchema = z.object({
  title: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
});

const updateActivitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
});

const deleteActivitySchema = z.object({
  id: z.string().min(1),
});

type GetByIdFormData = z.infer<typeof getByIdSchema>;
type CreateActivityFormData = z.infer<typeof createActivitySchema>;
type UpdateActivityFormData = z.infer<typeof updateActivitySchema>;
type DeleteActivityFormData = z.infer<typeof deleteActivitySchema>;

export function ActivitiesTestPanel() {
  const [getByIdTarget, setGetByIdTarget] = useState("");

  const getByIdForm = useForm<GetByIdFormData>({
    resolver: zodResolver(getByIdSchema),
    defaultValues: { activityId: "" },
  });

  const createForm = useForm<CreateActivityFormData>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: { title: "", date: "", description: "" },
  });

  const updateForm = useForm<UpdateActivityFormData>({
    resolver: zodResolver(updateActivitySchema),
    defaultValues: { id: "", title: "", date: "", description: "" },
  });

  const deleteForm = useForm<DeleteActivityFormData>({
    resolver: zodResolver(deleteActivitySchema),
    defaultValues: { id: "" },
  });

  const listQuery = useQuery({
    queryKey: [ApiPaths.activities_list],
    queryFn: () => apiClient.GET("/activities"),
    enabled: false,
  });

  const getQuery = useQuery({
    queryKey: [ApiPaths.activities_get, getByIdTarget],
    queryFn: () =>
      apiClient.GET("/activities/{id}", {
        params: { path: { id: getByIdTarget } },
      }),
    enabled: !!getByIdTarget,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateActivityFormData) =>
      apiClient.POST("/activities", {
        body: { title: data.title, date: data.date, description: data.description },
      }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateActivityFormData) =>
      apiClient.PUT("/activities/{id}", {
        params: { path: { id: data.id } },
        body: { title: data.title, date: data.date, description: data.description },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (data: DeleteActivityFormData) =>
      apiClient.DELETE("/activities/{id}", {
        params: { path: { id: data.id } },
      }),
  });

  const handleGetActivityById = (data: GetByIdFormData) => {
    setGetByIdTarget(data.activityId);
  };

  const handleCreateActivity = (data: CreateActivityFormData) => {
    createMutation.mutate(data, { onSuccess: () => createForm.reset() });
  };

  const handleUpdateActivity = (data: UpdateActivityFormData) => {
    updateMutation.mutate(data, { onSuccess: () => updateForm.reset() });
  };

  const handleDeleteActivity = (data: DeleteActivityFormData) => {
    deleteMutation.mutate(data, { onSuccess: () => deleteForm.reset() });
  };

  return (
    <TestPanelLayout title="Activities API Test Panel">
      {/* GET /activities */}
      <EndpointButton
        label="GET /activities"
        onClick={() => listQuery.refetch()}
        isLoading={listQuery.isFetching}
        isError={listQuery.isError}
        data={listQuery.data}
        error={listQuery.error}
      />

      {/* GET /activities/{id} */}
      <EndpointForm
        form={getByIdForm}
        onSubmit={handleGetActivityById}
        label="GET /activities/{id}"
        isLoading={getQuery.isFetching}
        isError={getQuery.isError}
        data={getQuery.data}
        error={getQuery.error}
      >
        <SimpleFormField control={getByIdForm.control} name="activityId" placeholder="Activity ID" />
      </EndpointForm>

      {/* POST /activities */}
      <EndpointForm
        form={createForm}
        onSubmit={handleCreateActivity}
        label="POST /activities"
        isLoading={createMutation.isPending}
        isError={createMutation.isError}
        data={createMutation.data}
        error={createMutation.error}
        formClassName="flex items-center gap-2 flex-wrap"
      >
        <SimpleFormField control={createForm.control} name="title" placeholder="Title" maxWidth="max-w-30" />
        <SimpleFormField control={createForm.control} name="date" placeholder="YYYY-MM" maxWidth="max-w-35" type="month" />
        <SimpleFormField control={createForm.control} name="description" placeholder="Description" maxWidth="max-w-40" />
      </EndpointForm>

      {/* PUT /activities/{id} */}
      <EndpointForm
        form={updateForm}
        onSubmit={handleUpdateActivity}
        label="PUT /activities/{id}"
        isLoading={updateMutation.isPending}
        isError={updateMutation.isError}
        data={updateMutation.data}
        error={updateMutation.error}
        formClassName="flex items-center gap-2 flex-wrap"
      >
        <SimpleFormField control={updateForm.control} name="id" placeholder="ID" />
        <SimpleFormField control={updateForm.control} name="title" placeholder="Title" maxWidth="max-w-30" />
        <SimpleFormField control={updateForm.control} name="date" placeholder="YYYY-MM" maxWidth="max-w-35" type="month" />
        <SimpleFormField control={updateForm.control} name="description" placeholder="Description" maxWidth="max-w-40" />
      </EndpointForm>

      {/* DELETE /activities/{id} */}
      <EndpointForm
        form={deleteForm}
        onSubmit={handleDeleteActivity}
        label="DELETE /activities/{id}"
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
