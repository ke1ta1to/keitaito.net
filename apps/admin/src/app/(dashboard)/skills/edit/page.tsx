"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { SkillsForm } from "../_components/skills-form";

function EditContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <p>Skill ID is required.</p>;
  }

  return <SkillsForm id={id} />;
}

export default function EditSkillPage() {
  return (
    <Suspense>
      <EditContent />
    </Suspense>
  );
}
