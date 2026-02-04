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

import { useContactGet, useContactUpdate } from "@/orval/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResponseDisplay } from "./response-display";

const updateContactSchema = z.object({
  email: z.string().email(),
  x: z.string().min(1),
});

type UpdateContactFormData = z.infer<typeof updateContactSchema>;

export function ContactTestPanel() {
  const updateForm = useForm<UpdateContactFormData>({
    resolver: zodResolver(updateContactSchema),
    defaultValues: {
      email: "",
      x: "",
    },
  });

  const getQuery = useContactGet({
    query: { enabled: false },
  });

  const updateMutation = useContactUpdate();

  const handleGetContact = () => {
    getQuery.refetch();
  };

  const handleUpdateContact = (data: UpdateContactFormData) => {
    updateMutation.mutate(
      {
        data: {
          email: data.email,
          x: data.x,
        },
      },
      {
        onSuccess: () => {
          updateForm.reset();
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Contact API Test Panel</h1>

      <div className="p-4 border rounded-lg space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          API Endpoints
        </h2>

        {/* GET /contact */}
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleGetContact}>
              GET /contact
            </Button>
          </div>
          <ResponseDisplay
            isLoading={getQuery.isFetching}
            isError={getQuery.isError}
            data={getQuery.data}
            error={getQuery.error}
          />
        </div>

        {/* PUT /contact */}
        <div>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdateContact)}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <FormField
                  control={updateForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          className="max-w-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="x"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="X Username"
                          className="max-w-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                type="submit"
                disabled={!updateForm.formState.isValid}
              >
                PUT /contact
              </Button>
            </form>
          </Form>
          <ResponseDisplay
            isLoading={updateMutation.isPending}
            isError={updateMutation.isError}
            data={updateMutation.data}
            error={updateMutation.error}
          />
        </div>
      </div>
    </div>
  );
}
