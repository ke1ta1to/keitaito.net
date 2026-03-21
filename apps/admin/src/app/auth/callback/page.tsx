"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { fetchAuthSession } from "@/lib/auth";

const MAX_RETRIES = 10;
const RETRY_INTERVAL_MS = 500;

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function pollSession() {
      for (let i = 0; i < MAX_RETRIES; i++) {
        if (cancelled) return;
        try {
          const session = await fetchAuthSession();
          if (session.tokens?.accessToken) {
            router.replace("/");
            return;
          }
        } catch {
          // retry
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
      }
      router.replace("/login");
    }

    pollSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="border-foreground/20 border-t-foreground h-8 w-8 animate-spin rounded-full border-4" />
    </div>
  );
}
