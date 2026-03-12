"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet";
import { IconEye } from "@tabler/icons-react";
import { useState } from "react";

export function PreviewLayout({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          {children}
          <Button
            className="mt-4 lg:hidden"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <IconEye />
            Preview
          </Button>
        </div>
        <div className="hidden space-y-2 lg:block">
          <h2 className="text-lg font-semibold">Preview</h2>
          {preview}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Preview</SheetTitle>
          </SheetHeader>
          <div className="p-4">{preview}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
