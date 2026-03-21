"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const queryClient = new QueryClient();

export function Providers(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>{props.children}</NuqsAdapter>
    </QueryClientProvider>
  );
}
