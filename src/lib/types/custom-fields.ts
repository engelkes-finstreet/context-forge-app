/**
 * Custom Fields Type Definitions
 *
 * Defines the type system for project-level custom field definitions
 * and subtask-level custom field values.
 */

/**
 * Supported custom field types for projects
 */
export type CustomFieldType = 'input' | 'select';

/**
 * Base field definition interface
 */
export interface CustomFieldDefinition {
  /** Unique identifier for the field */
  id: string;

  /** Internal name (camelCase, no spaces) - used as the key in subtask metadata */
  name: string;

  /** Display label shown in forms */
  label: string;

  /** Field type (input or select) */
  type: CustomFieldType;

  /** Whether the field is required */
  required: boolean;

  /** Placeholder text for the field */
  placeholder?: string;

  /** Help text/description */
  description?: string;

  /** Display order (lower numbers appear first) */
  order: number;

  /** Options for select fields (required if type is 'select') */
  options?: string[];
}

/**
 * Project custom fields configuration stored in Project.customFieldDefinitions
 */
export interface ProjectCustomFieldsConfig {
  fields: CustomFieldDefinition[];
}

/**
 * Custom field values stored in Subtask.metadata.customFields
 */
export interface SubtaskCustomFieldValues {
  [fieldName: string]: string | null | undefined;
}

/**
 * Helper type for creating a new field definition
 */
export type CreateCustomFieldDefinition = Omit<CustomFieldDefinition, 'id'>;

/**
 * Helper to generate a unique field ID
 */
export function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates that a field name is unique within a list of fields
 */
export function isFieldNameUnique(
  name: string,
  fields: CustomFieldDefinition[],
  excludeId?: string
): boolean {
  return !fields.some(
    (field) => field.name === name && field.id !== excludeId
  );
}

/**
 * Sorts fields by their order property
 */
export function sortFieldsByOrder(
  fields: CustomFieldDefinition[]
): CustomFieldDefinition[] {
  return [...fields].sort((a, b) => a.order - b.order);
}
