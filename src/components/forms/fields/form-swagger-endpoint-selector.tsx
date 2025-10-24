"use client";

import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues } from "react-hook-form";
import { SwaggerEndpointSelector } from "@/components/swagger/swagger-endpoint-selector";
import type { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { SwaggerEndpointSelectorFieldConfig } from "@/components/forms/dynamic-form-field/types";

/**
 * Encodes a SwaggerEndpoint to a string for form storage
 * Format: "METHOD:PATH"
 */
export function encodeEndpoint(endpoint: SwaggerEndpoint): string {
  return `${endpoint.method}:${endpoint.path}`;
}

/**
 * Decodes a string to find the matching SwaggerEndpoint
 */
export function decodeEndpoint(
  value: string,
  endpoints: SwaggerEndpoint[],
): SwaggerEndpoint | null {
  if (!value) return null;

  const [method, path] = value.split(":", 2);
  return endpoints.find((e) => e.method === method && e.path === path) || null;
}

interface FormSwaggerEndpointSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  fieldConfig: SwaggerEndpointSelectorFieldConfig<TFieldValues, TName>;
}

/**
 * Form-integrated Swagger Endpoint Selector
 *
 * This component wraps SwaggerEndpointSelector for use with react-hook-form.
 * It stores the endpoint as a string in the form (METHOD:PATH) and converts
 * it back to a SwaggerEndpoint object for display.
 *
 * @example
 * ```tsx
 * <FormSwaggerEndpointSelector
 *   name="endpoint"
 *   fieldConfig={{
 *     label: "API Endpoint",
 *     description: "Select the API endpoint for this request",
 *     placeholder: "Select endpoint..."
 *   }}
 *   endpoints={endpoints}
 *   loading={loading}
 * />
 * ```
 */
export function FormSwaggerEndpointSelector<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  fieldConfig,
}: FormSwaggerEndpointSelectorProps<TFieldValues, TName>) {
  const { endpoints } = fieldConfig;

  return (
    <FormField
      name={name}
      render={({ field }) => {
        // Decode the stored string value to a SwaggerEndpoint object
        const selectedEndpoint = field.value
          ? decodeEndpoint(field.value, endpoints)
          : null;

        return (
          <FormItem>
            {fieldConfig.label && <FormLabel>{fieldConfig.label}</FormLabel>}
            <FormControl>
              <SwaggerEndpointSelector
                endpoints={endpoints}
                value={selectedEndpoint}
                onValueChange={(endpoint) => {
                  // Encode the endpoint to a string for form storage
                  field.onChange(endpoint ? encodeEndpoint(endpoint) : "");
                }}
                placeholder={fieldConfig.placeholder}
                emptyText={fieldConfig.emptyText}
              />
            </FormControl>
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
