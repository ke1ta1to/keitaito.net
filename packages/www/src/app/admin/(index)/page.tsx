"use client";

import dynamic from "next/dynamic";

const AdminShell = dynamic(
  () => import("@/features/admin/components/pages/shell"),
  { ssr: false }
);

export default function AdminIndexPage() {
  return <AdminShell />;
}
