import type { PropsWithChildren } from "react";

import { AppHeader } from "./app-header";

export async function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-7xl px-4 pb-4">{children}</div>
    </>
  );
}
