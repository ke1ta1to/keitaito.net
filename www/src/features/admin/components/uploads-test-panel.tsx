"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResponseDisplay } from "./response-display";

const presignSchema = z.object({
  filename: z.string().min(1),
  content_type: z.string().min(1),
});

type PresignFormData = z.infer<typeof presignSchema>;

export function UploadsTestPanel() {
  const presignForm = useForm<PresignFormData>({
    resolver: zodResolver(presignSchema),
    defaultValues: { filename: "", content_type: "" },
  });

  const presignMutation = useMutation({
    mutationFn: (data: PresignFormData) =>
      apiClient.POST("/uploads/presign", {
        body: { filename: data.filename, content_type: data.content_type },
      }),
  });

  const handlePresign = (data: PresignFormData) => {
    presignMutation.mutate(data, {
      onSuccess: () => {
        presignForm.reset();
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Uploads API Test Panel</h1>

      <div className="p-4 border rounded-lg space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          API Endpoints
        </h2>

        {/* POST /uploads/presign */}
        <div>
          <Form {...presignForm}>
            <form
              onSubmit={presignForm.handleSubmit(handlePresign)}
              className="flex items-center gap-2 flex-wrap"
            >
              <FormField
                control={presignForm.control}
                name="filename"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Filename"
                        className="max-w-40"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={presignForm.control}
                name="content_type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Content-Type"
                        className="max-w-40"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                size="sm"
                type="submit"
                disabled={
                  !presignForm.formState.isValid || presignMutation.isPending
                }
              >
                POST /uploads/presign
              </Button>
            </form>
          </Form>
          <ResponseDisplay
            isLoading={presignMutation.isPending}
            isError={presignMutation.isError}
            data={presignMutation.data}
            error={presignMutation.error}
          />
        </div>
      </div>
    </div>
  );
}
