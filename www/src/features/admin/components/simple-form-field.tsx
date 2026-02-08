import {
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { HTMLInputTypeAttribute } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  maxWidth?: string;
  type?: HTMLInputTypeAttribute;
};

export function SimpleFormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  maxWidth = "max-w-50",
  type,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className={maxWidth}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
