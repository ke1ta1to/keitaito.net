"use client";

import { useMutation } from "@tanstack/react-query";

import { apiClient } from "../_components/api-client";

export function useUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await apiClient.POST("/uploads", {
        body: {
          filename: file.name,
          content_type: file.type || "application/octet-stream",
          content_length: file.size,
        },
      });
      if (!res.data) {
        throw new Error("Failed to get presigned URL");
      }

      const putRes = await fetch(res.data.url, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!putRes.ok) {
        throw new Error("Failed to upload file");
      }

      return `/uploads/${res.data.key}`;
    },
  });
}
