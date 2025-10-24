"use client";

import { CustomFieldDefinition } from "@/lib/types/custom-fields";
import { CustomFieldRenderer } from "./custom-field-renderer";

interface DynamicCustomFieldsProps {
  /** Array of custom field definitions from the project */
  fieldDefinitions: CustomFieldDefinition[];
  /** Prefix for the field names in the form (e.g., "customFields") */
  fieldNamePrefix?: string;
}

/**
 * Renders dynamic custom fields based on project field definitions
 *
 * This component is used in subtask forms to display custom fields
 * that were defined at the project level.
 */
export function DynamicCustomFields({
  fieldDefinitions,
  fieldNamePrefix = "customFields",
}: DynamicCustomFieldsProps) {
  if (fieldDefinitions.length === 0) {
    return null;
  }

  const sortedFields = [...fieldDefinitions].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">Project Custom Fields</h3>
        <p className="text-sm text-muted-foreground">
          These fields are defined at the project level
        </p>
      </div>

      <div className="space-y-4">
        {sortedFields.map((field) => (
          <CustomFieldRenderer
            key={field.id}
            field={field}
            fieldName={`${fieldNamePrefix}.${field.name}`}
          />
        ))}
      </div>
    </div>
  );
}
