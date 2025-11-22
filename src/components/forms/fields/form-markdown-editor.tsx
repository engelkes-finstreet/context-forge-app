"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/ui/markdown";
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
import { cn } from "@/lib/utils";

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
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormFieldLabel label={fieldConfig.label} tooltip={fieldConfig.tooltip} />
          <FormControl>
            <div className={cn(
              "grid gap-4",
              fieldConfig.layout === "vertical" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            )}>
              {/* Editor */}
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Editor
                </div>
                <Textarea
                  {...field}
                  placeholder={fieldConfig.placeholder}
                  rows={fieldConfig.rows || 10}
                  className="font-mono text-sm"
                />
              </div>

              {/* Preview */}
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Preview
                </div>
                <div className={cn(
                  "border rounded-md px-3 py-2 min-h-16 bg-muted/30",
                  "overflow-auto",
                  fieldConfig.rows && `max-h-[${fieldConfig.rows * 1.5}rem]`
                )}>
                  {field.value ? (
                    <Markdown content={field.value} />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Preview will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
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
