"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues } from "react-hook-form";
import { CheckboxFieldConfig } from "@/components/forms/dynamic-form-field/types";

interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  fieldConfig: CheckboxFieldConfig<any, any>;
}

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, fieldConfig }: FormCheckboxProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={field.disabled}
              onBlur={field.onBlur}
              name={field.name}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {fieldConfig.label && (
              <FormLabel className="text-sm font-medium">
                {fieldConfig.label}
              </FormLabel>
            )}
            {fieldConfig.description && (
              <FormDescription>{fieldConfig.description}</FormDescription>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
