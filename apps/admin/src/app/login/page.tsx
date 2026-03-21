"use client";

import { Button } from "@repo/ui/components/ui/button";
import { IconLogin2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-foreground/20 border-t-foreground h-8 w-8 animate-spin rounded-full border-4" />
      </div>
    );
  }

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-xs px-4">
        <div className="ring-foreground/10 bg-card flex flex-col gap-8 p-6 ring-1">
          <div className="flex flex-col gap-2">
            <h1 className="text-foreground text-sm font-semibold tracking-tight">
              keitaito.net
            </h1>
            <p className="text-muted-foreground text-xs">Admin Dashboard</p>
          </div>

          <div className="bg-border h-px" />

          <Button size="lg" className="w-full" onClick={() => signIn()}>
            <IconLogin2 data-icon="inline-start" className="size-4" />
            Sign in
          </Button>
        </div>

        <p className="text-muted-foreground/50 mt-4 text-center text-[10px]">
          Authenticated via Amazon Cognito
        </p>
      </div>
    </div>
  );
}
