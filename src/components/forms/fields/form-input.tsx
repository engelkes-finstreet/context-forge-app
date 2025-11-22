"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues } from "react-hook-form";
import { InputFieldConfig } from "@/components/forms/dynamic-form-field/types";
import { FormFieldLabel } from "./form-field-label";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: TName;
  fieldConfig: InputFieldConfig<any, any>;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, fieldConfig }: FormInputProps<TFieldValues, TName>) {
  const inputType = fieldConfig.inputType || "text";
  const isNumberInput = inputType === "number";

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormFieldLabel label={fieldConfig.label} tooltip={fieldConfig.tooltip} />
          <FormControl>
            <Input
              {...field}
              placeholder={fieldConfig.placeholder}
              type={inputType}
              onChange={(e) => {
                const value = e.target.value;
                if (isNumberInput) {
                  // Convert to number if value exists, otherwise use empty string
                  field.onChange(value === "" ? "" : Number(value));
                } else {
                  field.onChange(value);
                }
              }}
              value={field.value ?? ""}
            />
          </FormControl>
          {fieldConfig.description && (
            <FormDescription>{fieldConfig.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
