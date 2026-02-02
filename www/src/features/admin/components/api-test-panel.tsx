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
  useActivitiesCreate,
  useActivitiesDelete,
  useActivitiesGet,
  useActivitiesList,
  useActivitiesUpdate,
} from "@/orval/client";
import { getCurrentUser, signInWithRedirect, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod Schemas
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

export function ApiTestPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [getByIdTarget, setGetByIdTarget] = useState("");

  // React Hook Form instances
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

  // React Query hooks
  const listQuery = useActivitiesList({
    query: { enabled: false },
  });

  const getQuery = useActivitiesGet(getByIdTarget, {
    query: { enabled: !!getByIdTarget },
  });

  const createMutation = useActivitiesCreate();
  const updateMutation = useActivitiesUpdate();
  const deleteMutation = useActivitiesDelete();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    await signInWithRedirect();
  };

  const handleSignOut = async () => {
    await signOut();
    setIsAuthenticated(false);
  };

  const handleGetActivities = () => {
    listQuery.refetch();
  };

  const handleGetActivityById = (data: GetByIdFormData) => {
    setGetByIdTarget(data.activityId);
  };

  const handleCreateActivity = (data: CreateActivityFormData) => {
    createMutation.mutate(
      {
        data: {
          title: data.title,
          date: data.date,
          description: data.description,
        },
      },
      {
        onSuccess: () => {
          createForm.reset();
        },
      },
    );
  };

  const handleUpdateActivity = (data: UpdateActivityFormData) => {
    updateMutation.mutate(
      {
        id: data.id,
        data: {
          title: data.title,
          date: data.date,
          description: data.description,
        },
      },
      {
        onSuccess: () => {
          updateForm.reset();
        },
      },
    );
  };

  const handleDeleteActivity = (data: DeleteActivityFormData) => {
    deleteMutation.mutate(
      { id: data.id },
      {
        onSuccess: () => {
          deleteForm.reset();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">API Test Panel</h1>
        <span
          className={`px-2 py-1 text-xs rounded ${
            isAuthenticated
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          {isAuthenticated ? "Authenticated" : "Not Authenticated"}
        </span>
      </div>

      {/* Auth Section */}
      <div className="p-4 border rounded-lg space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Authentication
        </h2>
        {isAuthenticated ? (
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        ) : (
          <Button variant="outline" onClick={handleSignIn}>
            Sign In
          </Button>
        )}
      </div>

      {/* API Test Section */}
      <div className="p-4 border rounded-lg space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          API Endpoints
        </h2>

        {/* GET /activities */}
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleGetActivities}>
              GET /activities
            </Button>
          </div>
          <ResponseDisplay
            isLoading={listQuery.isFetching}
            isError={listQuery.isError}
            data={listQuery.data}
            error={listQuery.error}
          />
        </div>

        {/* GET /activities/{id} */}
        <div>
          <Form {...getByIdForm}>
            <form
              onSubmit={getByIdForm.handleSubmit(handleGetActivityById)}
              className="flex items-center gap-2"
            >
              <FormField
                control={getByIdForm.control}
                name="activityId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Activity ID"
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
                GET /activities/&#123;id&#125;
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

        {/* POST /activities */}
        <div>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreateActivity)}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="month"
                        placeholder="YYYY-MM"
                        className="max-w-35"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Description"
                        className="max-w-40"
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
                POST /activities
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

        {/* PUT /activities/{id} */}
        <div>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdateActivity)}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="month"
                        placeholder="YYYY-MM"
                        className="max-w-35"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Description"
                        className="max-w-40"
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
                PUT /activities/&#123;id&#125;
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

        {/* DELETE /activities/{id} */}
        <div>
          <Form {...deleteForm}>
            <form
              onSubmit={deleteForm.handleSubmit(handleDeleteActivity)}
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
                DELETE /activities/&#123;id&#125;
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
