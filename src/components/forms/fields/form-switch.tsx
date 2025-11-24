"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues } from "react-hook-form";
import { SwitchFieldConfig } from "@/components/forms/dynamic-form-field/types";
import { FormFieldLabel } from "./form-field-label";
import { cn } from "@/lib/utils";

interface FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  fieldConfig: SwitchFieldConfig<any, any>;
}

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, fieldConfig }: FormSwitchProps<TFieldValues, TName>) {
  const [uncheckedOption, checkedOption] = fieldConfig.options;

  return (
    <FormField
      name={name}
      render={({ field }) => {
        const isChecked = field.value === checkedOption.value;

        return (
          <FormItem>
            <FormFieldLabel
              label={fieldConfig.label}
              tooltip={fieldConfig.tooltip}
            />
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "text-sm transition-colors",
                  !isChecked
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {uncheckedOption.label}
              </span>
              <FormControl>
                <Switch
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    field.onChange(
                      checked ? checkedOption.value : uncheckedOption.value,
                    );
                  }}
                  disabled={field.disabled}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              </FormControl>
              <span
                className={cn(
                  "text-sm transition-colors",
                  isChecked
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {checkedOption.label}
              </span>
            </div>
            {fieldConfig.description && (
              <FormDescription>{fieldConfig.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
