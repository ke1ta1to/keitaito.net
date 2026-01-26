"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  signInWithRedirect,
  signOut,
  fetchAuthSession,
  getCurrentUser,
} from "aws-amplify/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ResponseState = {
  status: "idle" | "loading" | "success" | "error";
  data: unknown;
  error?: string;
};

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
  const [response, setResponse] = useState<ResponseState>({
    status: "idle",
    data: null,
  });

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
    setResponse({ status: "idle", data: null });
  };

  const getToken = async () => {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString();
  };

  const apiCall = async (method: string, path: string, body?: object) => {
    const token = await getToken();

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) {
      return { message: "Deleted successfully" };
    }
    return res.json();
  };

  const executeApiCall = async (
    method: string,
    path: string,
    body?: object,
  ) => {
    setResponse({ status: "loading", data: null });
    try {
      const data = await apiCall(method, path, body);
      setResponse({ status: "success", data });
    } catch (err) {
      setResponse({
        status: "error",
        data: null,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleGetActivities = () => executeApiCall("GET", "/activities");

  const handleGetActivityById = () => {
    if (!activityId.trim()) return;
    executeApiCall("GET", `/activities/${activityId.trim()}`);
  };

  const handleCreateActivity = () => {
    executeApiCall("POST", "/activities", {
      title: newTitle.trim(),
      date: newDate.trim(),
      description: newDescription.trim(),
    });
    setNewTitle("");
    setNewDate("");
    setNewDescription("");
  };

  const handleUpdateActivity = () => {
    executeApiCall("PUT", `/activities/${updateId.trim()}`, {
      title: updateTitle.trim(),
      date: updateDate.trim(),
      description: updateDescription.trim(),
    });
    setUpdateTitle("");
    setUpdateDate("");
    setUpdateDescription("");
  };

  const handleDeleteActivity = () => {
    executeApiCall("DELETE", `/activities/${deleteId.trim()}`);
    setDeleteId("");
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
      {response.status !== "idle" && (
        <div className="p-4 border rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Response
            </h2>
            {response.status === "loading" && (
              <span className="text-xs text-muted-foreground">Loading...</span>
            )}
            {response.status === "success" && (
              <span className="text-xs text-green-600 dark:text-green-400">
                Success
              </span>
            )}
            {response.status === "error" && (
              <span className="text-xs text-red-600 dark:text-red-400">
                Error
              </span>
            )}
          </div>
          <pre className="p-3 bg-muted rounded text-sm font-mono overflow-auto max-h-100">
            {response.status === "error"
              ? response.error
              : JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
