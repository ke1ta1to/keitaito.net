import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { useEffect, useState } from "react";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const [state, setState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    getCurrentUser()
      .then(() => setState("authenticated"))
      .catch(() => setState("unauthenticated"));
  }, []);

  if (state === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (state === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>管理パネル</CardTitle>
            <CardDescription>
              ログインして管理パネルにアクセスします。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => signInWithRedirect()}>
              ログイン
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
