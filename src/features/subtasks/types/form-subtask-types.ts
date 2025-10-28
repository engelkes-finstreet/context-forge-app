import type {
  FormFieldConfig,
  InputFieldConfig,
  SelectableCardFieldConfig,
  NumberFieldConfig,
  CreateFormSubtaskFormInput,
} from "../forms/form-subtask/create-form-subtask-form-schema";

// Re-export all form field types for convenience
export type {
  FormFieldConfig,
  InputFieldConfig,
  SelectableCardFieldConfig,
  NumberFieldConfig,
  CreateFormSubtaskFormInput,
};

// Type guards for discriminating field types
export function isInputField(
  field: FormFieldConfig,
): field is InputFieldConfig {
  return field.fieldType === "input";
}

export function isSelectableCardField(
  field: FormFieldConfig,
): field is SelectableCardFieldConfig {
  return field.fieldType === "selectable-card";
}

export function isNumberField(
  field: FormFieldConfig,
): field is NumberFieldConfig {
  return field.fieldType === "number";
}

// Metadata structure for database storage
export interface FormSubtaskMetadata {
  fields: FormFieldConfig[];
}
