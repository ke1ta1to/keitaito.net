"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useWorksCreate,
  useWorksDelete,
  useWorksGet,
  useWorksList,
  useWorksUpdate,
} from "@/orval/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResponseDisplay } from "./response-display";

// Zod Schemas
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

  // React Hook Form instances
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

  // React Query hooks
  const listQuery = useWorksList({
    query: { enabled: false },
  });

  const getQuery = useWorksGet(getByIdTarget, {
    query: { enabled: !!getByIdTarget },
  });

  const createMutation = useWorksCreate();
  const updateMutation = useWorksUpdate();
  const deleteMutation = useWorksDelete();

  const handleGetWorks = () => {
    listQuery.refetch();
  };

  const handleGetWorkById = (data: GetByIdFormData) => {
    setGetByIdTarget(data.workId);
  };

  const handleCreateWork = (data: CreateWorkFormData) => {
    createMutation.mutate(
      {
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          thumbnail: data.thumbnail,
        },
      },
      {
        onSuccess: () => {
          createForm.reset();
        },
      },
    );
  };

  const handleUpdateWork = (data: UpdateWorkFormData) => {
    updateMutation.mutate(
      {
        id: data.id,
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          thumbnail: data.thumbnail,
        },
      },
      {
        onSuccess: () => {
          updateForm.reset();
        },
      },
    );
  };

  const handleDeleteWork = (data: DeleteWorkFormData) => {
    deleteMutation.mutate(
      { id: data.id },
      {
        onSuccess: () => {
          deleteForm.reset();
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <h1 className="text-xl font-semibold">Works API Test Panel</h1>

      {/* API Test Section */}
      <div className="p-4 border rounded-lg space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          API Endpoints
        </h2>

        {/* GET /works */}
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleGetWorks}>
              GET /works
            </Button>
          </div>
          <ResponseDisplay
            isLoading={listQuery.isFetching}
            isError={listQuery.isError}
            data={listQuery.data}
            error={listQuery.error}
          />
        </div>

        {/* GET /works/{id} */}
        <div>
          <Form {...getByIdForm}>
            <form
              onSubmit={getByIdForm.handleSubmit(handleGetWorkById)}
              className="flex items-center gap-2"
            >
              <FormField
                control={getByIdForm.control}
                name="workId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Work ID"
                        className="max-w-50"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                size="sm"
                type="submit"
                disabled={!getByIdForm.formState.isValid}
              >
                GET /works/&#123;id&#125;
              </Button>
            </form>
          </Form>
          <ResponseDisplay
            isLoading={getQuery.isFetching}
            isError={getQuery.isError}
            data={getQuery.data}
            error={getQuery.error}
          />
        </div>

        {/* POST /works */}
        <div>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreateWork)}
              className="flex items-center gap-2 flex-wrap"
            >
              <FormField
                control={createForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        className="max-w-30"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Slug"
                        className="max-w-35"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Content"
                        className="max-w-40"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Thumbnail URL"
                        className="max-w-50"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                size="sm"
                type="submit"
                disabled={!createForm.formState.isValid}
              >
                POST /works
              </Button>
            </form>
          </Form>
          <ResponseDisplay
            isLoading={createMutation.isPending}
            isError={createMutation.isError}
            data={createMutation.data}
            error={createMutation.error}
          />
        </div>

        {/* PUT /works/{id} */}
        <div>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdateWork)}
              className="flex items-center gap-2 flex-wrap"
            >
              <FormField
                control={updateForm.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="ID"
                        className="max-w-50"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        className="max-w-30"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Slug"
                        className="max-w-35"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Content"
                        className="max-w-40"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Thumbnail URL"
                        className="max-w-50"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                size="sm"
                type="submit"
                disabled={!updateForm.formState.isValid}
              >
                PUT /works/&#123;id&#125;
              </Button>
            </form>
          </Form>
          <ResponseDisplay
            isLoading={updateMutation.isPending}
            isError={updateMutation.isError}
            data={updateMutation.data}
            error={updateMutation.error}
          />
        </div>

        {/* DELETE /works/{id} */}
        <div>
          <Form {...deleteForm}>
            <form
              onSubmit={deleteForm.handleSubmit(handleDeleteWork)}
              className="flex items-center gap-2"
            >
              <FormField
                control={deleteForm.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="ID"
                        className="max-w-50"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                size="sm"
                type="submit"
                disabled={!deleteForm.formState.isValid}
              >
                DELETE /works/&#123;id&#125;
              </Button>
            </form>
          </Form>
          <ResponseDisplay
            isLoading={deleteMutation.isPending}
            isError={deleteMutation.isError}
            data={
              deleteMutation.isSuccess
                ? { message: "Deleted successfully" }
                : null
            }
            error={deleteMutation.error}
          />
        </div>
      </div>
    </div>
  );
}
