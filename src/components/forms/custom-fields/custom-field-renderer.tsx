"use client";

import { CustomFieldDefinition } from "@/lib/types/custom-fields";
import { FormInput } from "@/components/forms/fields/form-input";
import { FormSelect } from "@/components/forms/fields/form-select";
import { InputFieldConfig, SelectFieldConfig } from "@/components/forms/dynamic-form-field/types";

interface CustomFieldRendererProps {
  /** The custom field definition */
  field: CustomFieldDefinition;
  /** The form field name (e.g., "customFields.featureName") */
  fieldName: string;
}

/**
 * Renders a single custom field based on its type
 *
 * Converts custom field definitions to the appropriate form field component
 * (FormInput or FormSelect) with the correct configuration.
 */
export function CustomFieldRenderer({
  field,
  fieldName,
}: CustomFieldRendererProps) {
  switch (field.type) {
    case "input": {
      const inputConfig: InputFieldConfig<any, any> = {
        type: "input",
        label: field.label,
        placeholder: field.placeholder,
        description: field.description,
        inputType: "text",
      };

      return <FormInput name={fieldName as any} fieldConfig={inputConfig} />;
    }

    case "select": {
      const selectConfig: SelectFieldConfig<any, any> = {
        type: "select",
        label: field.label,
        placeholder: field.placeholder || "Select an option",
        description: field.description,
        options:
          field.options?.map((option) => ({
            label: option,
            value: option,
          })) || [],
      };

      return <FormSelect name={fieldName as any} fieldConfig={selectConfig} />;
    }

    default:
      console.warn(`Unknown custom field type: ${field.type}`);
      return null;
  }
}
