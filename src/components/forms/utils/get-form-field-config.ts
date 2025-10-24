import { FormFieldConfig } from "@/components/forms/dynamic-form-field/types";
import { ArrayFieldConfig, FormFieldsType } from "@/components/forms/types";

export function getFormFieldConfig<T>(
  fieldName: string,
  fields: FormFieldsType<T>,
): FormFieldConfig<T, any> | ArrayFieldConfig<any, T> {
  const keys = (fieldName as string)
    .split(".")
    .filter((key) => isNaN(Number(key)));
  let result: any = fields;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      throw new Error(`Field ${fieldName} not found in config`);
    }
  }

  // Check if the result is a valid field configuration
  if (typeof result === "object" && "type" in result) {
    return result;
  } else {
    throw new Error(`Invalid field configuration for ${fieldName}`);
  }
}
