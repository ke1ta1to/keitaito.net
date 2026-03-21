"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { WorksForm } from "../_components/works-form";

function EditContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <p>Work ID is required.</p>;
  }

  return <WorksForm id={id} />;
}

export default function EditWorkPage() {
  return (
    <Suspense>
      <EditContent />
    </Suspense>
  );
}
