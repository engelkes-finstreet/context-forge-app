import type {
  FormFieldConfig,
  InputFieldConfig,
  SelectableCardFieldConfig,
  HiddenFieldConfig,
  CreateFormSubtaskFormInput,
} from "../forms/form-subtask/create-form-subtask-form-schema";

// Re-export all form field types for convenience
export type {
  FormFieldConfig,
  InputFieldConfig,
  SelectableCardFieldConfig,
  HiddenFieldConfig,
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

export function isHiddenField(
  field: FormFieldConfig,
): field is HiddenFieldConfig {
  return field.fieldType === "hidden";
}

// Metadata structure for database storage
export interface FormSubtaskMetadata {
  fields: FormFieldConfig[];
}
