import type { ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ResponseDisplay } from "./response-display";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  label: string;
  isLoading: boolean;
  isError: boolean;
  data: unknown;
  error: Error | null;
  children: ReactNode;
  successData?: unknown;
  formClassName?: string;
};

export function EndpointForm<T extends FieldValues>({
  form,
  onSubmit,
  label,
  isLoading,
  isError,
  data,
  error,
  children,
  successData,
  formClassName = "flex items-center gap-2",
}: Props<T>) {
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={formClassName}
        >
          {children}
          <Button
            variant="outline"
            size="sm"
            type="submit"
            disabled={!form.formState.isValid}
          >
            {label}
          </Button>
        </form>
      </Form>
      <ResponseDisplay
        isLoading={isLoading}
        isError={isError}
        data={successData !== undefined ? successData : data}
        error={error}
      />
    </div>
  );
}
