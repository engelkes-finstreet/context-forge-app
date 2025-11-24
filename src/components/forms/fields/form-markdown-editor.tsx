"use client";

import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues } from "react-hook-form";
import { MarkdownFieldConfig } from "@/components/forms/dynamic-form-field/types";
import { FormFieldLabel } from "./form-field-label";
import { MarkdownEditorClient } from "./markdown-editor-client";

interface FormMarkdownEditorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: TName;
  fieldConfig: MarkdownFieldConfig<any, any>;
}

export function FormMarkdownEditor<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, fieldConfig }: FormMarkdownEditorProps<TFieldValues, TName>) {
  // Calculate height based on rows (approximate 24px per row)
  const height = fieldConfig.rows ? fieldConfig.rows * 24 : 500;

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormFieldLabel label={fieldConfig.label} tooltip={fieldConfig.tooltip} />
          <FormControl>
            <MarkdownEditorClient
              value={field.value || ""}
              onChange={field.onChange}
              placeholder={fieldConfig.placeholder}
              height={height}
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
