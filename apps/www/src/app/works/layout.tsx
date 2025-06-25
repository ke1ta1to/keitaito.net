import type { Metadata } from "next";

import AppLayout from "@/components/app-layout";

export const metadata: Metadata = {
  title: {
    default: "Works | Keita Ito",
    template: "%s | Works | Keita Ito",
  },
};

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="prose prose-img:mx-auto mt-4 px-2">{children}</div>
    </AppLayout>
  );
}
