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

import { useProfileGet, useProfileUpdate } from "@/orval/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResponseDisplay } from "./response-display";

const updateProfileSchema = z.object({
  name: z.string().min(1),
  birthday: z.string().min(1),
  location: z.string().min(1),
  school: z.string().min(1),
  image_url: z.string().url(),
  x: z.string().url(),
  github: z.string().url(),
  zenn: z.string().url(),
  qiita: z.string().url(),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export function ProfileTestPanel() {
  const updateForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      birthday: "",
      location: "",
      school: "",
      image_url: "",
      x: "",
      github: "",
      zenn: "",
      qiita: "",
    },
  });

  const getQuery = useProfileGet({
    query: { enabled: false },
  });

  const updateMutation = useProfileUpdate();

  const handleGetProfile = () => {
    getQuery.refetch();
  };

  const handleUpdateProfile = (data: UpdateProfileFormData) => {
    updateMutation.mutate(
      {
        data: {
          name: data.name,
          birthday: data.birthday,
          location: data.location,
          school: data.school,
          image_url: data.image_url,
          x: data.x,
          github: data.github,
          zenn: data.zenn,
          qiita: data.qiita,
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
      <h1 className="text-xl font-semibold">Profile API Test Panel</h1>

      <div className="p-4 border rounded-lg space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          API Endpoints
        </h2>

        {/* GET /profile */}
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleGetProfile}>
              GET /profile
            </Button>
          </div>
          <ResponseDisplay
            isLoading={getQuery.isFetching}
            isError={getQuery.isError}
            data={getQuery.data}
            error={getQuery.error}
          />
        </div>

        {/* PUT /profile */}
        <div>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdateProfile)}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <FormField
                  control={updateForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          className="max-w-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Birthday"
                          className="max-w-40"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Location"
                          className="max-w-40"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="School"
                          className="max-w-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Image URL"
                          className="max-w-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <FormField
                  control={updateForm.control}
                  name="x"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="X URL"
                          className="max-w-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="GitHub URL"
                          className="max-w-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="zenn"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Zenn URL"
                          className="max-w-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="qiita"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Qiita URL"
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
                PUT /profile
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
