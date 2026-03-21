"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { ActivitiesForm } from "../_components/activities-form";

function EditContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <p>Activity ID is required.</p>;
  }

  return <ActivitiesForm id={id} />;
}

export default function EditActivityPage() {
  return (
    <Suspense>
      <EditContent />
    </Suspense>
  );
}
