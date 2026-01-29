"use client";

import { Button } from "@/components/ui/button";
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

type ActiveOperation =
  | { type: "list" }
  | { type: "get"; id: string }
  | { type: "create" }
  | { type: "update" }
  | { type: "delete" };

export function ApiTestPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activityId, setActivityId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [activeOperation, setActiveOperation] =
    useState<ActiveOperation | null>(null);

  // React Query hooks
  const listQuery = useActivitiesList({
    query: { enabled: false },
  });

  const getQuery = useActivitiesGet(
    activeOperation?.type === "get" ? activeOperation.id : "",
    {
      query: {
        enabled: activeOperation?.type === "get" && !!activeOperation.id,
      },
    },
  );

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
    setActiveOperation(null);
  };

  const handleGetActivities = () => {
    setActiveOperation({ type: "list" });
    listQuery.refetch();
  };

  const handleGetActivityById = () => {
    if (!activityId.trim()) return;
    setActiveOperation({ type: "get", id: activityId.trim() });
  };

  const handleCreateActivity = () => {
    setActiveOperation({ type: "create" });
    createMutation.mutate(
      {
        data: {
          title: newTitle.trim(),
          date: newDate.trim(),
          description: newDescription.trim(),
        },
      },
      {
        onSuccess: () => {
          setNewTitle("");
          setNewDate("");
          setNewDescription("");
        },
      },
    );
  };

  const handleUpdateActivity = () => {
    setActiveOperation({ type: "update" });
    updateMutation.mutate(
      {
        id: updateId.trim(),
        data: {
          title: updateTitle.trim(),
          date: updateDate.trim(),
          description: updateDescription.trim(),
        },
      },
      {
        onSuccess: () => {
          setUpdateId("");
          setUpdateTitle("");
          setUpdateDate("");
          setUpdateDescription("");
        },
      },
    );
  };

  const handleDeleteActivity = () => {
    setActiveOperation({ type: "delete" });
    deleteMutation.mutate(
      { id: deleteId.trim() },
      {
        onSuccess: () => {
          setDeleteId("");
        },
      },
    );
  };

  // Get current response state based on active operation
  const getResponseState = () => {
    if (!activeOperation) return null;

    switch (activeOperation.type) {
      case "list":
        return {
          isLoading: listQuery.isFetching,
          isError: listQuery.isError,
          data: listQuery.data,
          error: listQuery.error,
        };
      case "get":
        return {
          isLoading: getQuery.isFetching,
          isError: getQuery.isError,
          data: getQuery.data,
          error: getQuery.error,
        };
      case "create":
        return {
          isLoading: createMutation.isPending,
          isError: createMutation.isError,
          data: createMutation.data,
          error: createMutation.error,
        };
      case "update":
        return {
          isLoading: updateMutation.isPending,
          isError: updateMutation.isError,
          data: updateMutation.data,
          error: updateMutation.error,
        };
      case "delete":
        return {
          isLoading: deleteMutation.isPending,
          isError: deleteMutation.isError,
          data: deleteMutation.isSuccess
            ? { message: "Deleted successfully" }
            : null,
          error: deleteMutation.error,
        };
    }
  };

  const responseState = getResponseState();

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
      <div className="p-4 border rounded-lg space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          API Endpoints
        </h2>

        {/* GET /activities */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGetActivities}>
            GET /activities
          </Button>
        </div>

        {/* GET /activities/{id} */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Activity ID"
            value={activityId}
            onChange={(e) => setActivityId(e.target.value)}
            className="max-w-50"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetActivityById}
            disabled={!activityId.trim()}
          >
            GET /activities/&#123;id&#125;
          </Button>
        </div>

        {/* POST /activities */}
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="max-w-30"
          />
          <Input
            type="month"
            placeholder="YYYY-MM"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="max-w-35"
          />
          <Input
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="max-w-40"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateActivity}
            disabled={
              !newTitle.trim() || !newDate.trim() || !newDescription.trim()
            }
          >
            POST /activities
          </Button>
        </div>

        {/* PUT /activities/{id} */}
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            placeholder="ID"
            value={updateId}
            onChange={(e) => setUpdateId(e.target.value)}
            className="max-w-50"
          />
          <Input
            placeholder="Title"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            className="max-w-30"
          />
          <Input
            type="month"
            placeholder="YYYY-MM"
            value={updateDate}
            onChange={(e) => setUpdateDate(e.target.value)}
            className="max-w-35"
          />
          <Input
            placeholder="Description"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            className="max-w-40"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateActivity}
            disabled={
              !updateId.trim() ||
              !updateTitle.trim() ||
              !updateDate.trim() ||
              !updateDescription.trim()
            }
          >
            PUT /activities/&#123;id&#125;
          </Button>
        </div>

        {/* DELETE /activities/{id} */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="ID"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            className="max-w-50"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteActivity}
            disabled={!deleteId.trim()}
          >
            DELETE /activities/&#123;id&#125;
          </Button>
        </div>
      </div>

      {/* Response Display */}
      {responseState && (
        <div className="p-4 border rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Response
            </h2>
            {responseState.isLoading && (
              <span className="text-xs text-muted-foreground">Loading...</span>
            )}
            {!responseState.isLoading &&
              !responseState.isError &&
              responseState.data && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  Success
                </span>
              )}
            {responseState.isError && (
              <span className="text-xs text-red-600 dark:text-red-400">
                Error
              </span>
            )}
          </div>
          <pre className="p-3 bg-muted rounded text-sm font-mono overflow-auto max-h-100">
            {responseState.isError
              ? responseState.error instanceof Error
                ? responseState.error.message
                : "Unknown error"
              : JSON.stringify(responseState.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
