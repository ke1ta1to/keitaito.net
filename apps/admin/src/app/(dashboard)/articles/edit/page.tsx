"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { ArticlesForm } from "../_components/articles-form";

function EditContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <p>Article ID is required.</p>;
  }

  return <ArticlesForm id={id} />;
}

export default function EditArticlePage() {
  return (
    <Suspense>
      <EditContent />
    </Suspense>
  );
}
