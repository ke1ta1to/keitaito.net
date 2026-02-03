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
  useSkillsCreate,
  useSkillsDelete,
  useSkillsGet,
  useSkillsList,
  useSkillsUpdate,
} from "@/orval/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod Schemas
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

function ResponseDisplay({
  isLoading,
  isError,
  data,
  error,
}: {
  isLoading: boolean;
  isError: boolean;
  data: unknown;
  error: Error | null;
}) {
  if (!isLoading && !isError && !data) return null;

  const content: string = isError
    ? error instanceof Error
      ? error.message
      : "Unknown error"
    : (JSON.stringify(data, null, 2) ?? "");

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2">
        {isLoading && (
          <span className="text-xs text-muted-foreground">Loading...</span>
        )}
        {!isLoading && !isError && !!data && (
          <span className="text-xs text-green-600 dark:text-green-400">
            Success
          </span>
        )}
        {isError && (
          <span className="text-xs text-red-600 dark:text-red-400">Error</span>
        )}
      </div>
      <pre className="p-3 bg-muted rounded text-sm font-mono overflow-auto max-h-60">
        {content}
      </pre>
    </div>
  );
}

export function SkillsTestPanel() {
  const [getByIdTarget, setGetByIdTarget] = useState("");

  // React Hook Form instances
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

  // React Query hooks
  const listQuery = useSkillsList({
    query: { enabled: false },
  });

  const getQuery = useSkillsGet(getByIdTarget, {
    query: { enabled: !!getByIdTarget },
  });

  const createMutation = useSkillsCreate();
  const updateMutation = useSkillsUpdate();
  const deleteMutation = useSkillsDelete();

  const handleGetSkills = () => {
    listQuery.refetch();
  };

  const handleGetSkillById = (data: GetByIdFormData) => {
    setGetByIdTarget(data.skillId);
  };

  const handleCreateSkill = (data: CreateSkillFormData) => {
    createMutation.mutate(
      {
        data: {
          name: data.name,
          icon_url: data.icon_url,
        },
      },
      {
        onSuccess: () => {
          createForm.reset();
        },
      },
    );
  };

  const handleUpdateSkill = (data: UpdateSkillFormData) => {
    updateMutation.mutate(
      {
        id: data.id,
        data: {
          name: data.name,
          icon_url: data.icon_url,
        },
      },
      {
        onSuccess: () => {
          updateForm.reset();
        },
      },
    );
  };

  const handleDeleteSkill = (data: DeleteSkillFormData) => {
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
      <h1 className="text-xl font-semibold">Skills API Test Panel</h1>

      {/* API Test Section */}
      <div className="p-4 border rounded-lg space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          API Endpoints
        </h2>

        {/* GET /skills */}
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleGetSkills}>
              GET /skills
            </Button>
          </div>
          <ResponseDisplay
            isLoading={listQuery.isFetching}
            isError={listQuery.isError}
            data={listQuery.data}
            error={listQuery.error}
          />
        </div>

        {/* GET /skills/{id} */}
        <div>
          <Form {...getByIdForm}>
            <form
              onSubmit={getByIdForm.handleSubmit(handleGetSkillById)}
              className="flex items-center gap-2"
            >
              <FormField
                control={getByIdForm.control}
                name="skillId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Skill ID"
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
                GET /skills/&#123;id&#125;
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

        {/* POST /skills */}
        <div>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreateSkill)}
              className="flex items-center gap-2 flex-wrap"
            >
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        className="max-w-30"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="icon_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Icon URL"
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
                POST /skills
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

        {/* PUT /skills/{id} */}
        <div>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdateSkill)}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        className="max-w-30"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="icon_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Icon URL"
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
                PUT /skills/&#123;id&#125;
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

        {/* DELETE /skills/{id} */}
        <div>
          <Form {...deleteForm}>
            <form
              onSubmit={deleteForm.handleSubmit(handleDeleteSkill)}
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
                DELETE /skills/&#123;id&#125;
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
