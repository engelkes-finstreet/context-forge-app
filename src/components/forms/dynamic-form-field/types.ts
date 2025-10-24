import { SwaggerEndpoint } from "@/lib/services/swagger-service";

export enum BaseField {
  HIDDEN = "hidden",
  INPUT = "input",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  SELECT = "select",
  SWAGGER_ENDPOINT_SELECTOR = "swagger_endpoint_selector",
  CHECKBOX = "checkbox",
  DATE_PICKER = "date_picker",
  DATE_RANGE_PICKER = "date_range_picker",
}

export type BaseFieldConfig<
  FormValues,
  FieldName extends keyof FormValues,
  FieldType extends string,
> = {
  label: string;
  description?: string;
  placeholder?: string;
  renderCondition?: (values: FormValues) => boolean;
  type: FieldType;
  asyncValidate?: (value: FormValues[FieldName]) => Promise<string | undefined>;
  caption?: string;
};

export type HiddenFieldConfig = {
  type: "hidden";
};

export type InputFieldConfig<FormValues, FieldName extends keyof FormValues> = {
  onClear?: () => void;
  suffix?: string;
  inputType?: "text" | "email" | "url" | "tel" | "number" | "search";
} & BaseFieldConfig<FormValues, FieldName, "input">;

export type PasswordFieldConfig<
  FormValues,
  FieldName extends keyof FormValues,
> = Omit<BaseFieldConfig<FormValues, FieldName, "password">, "asyncValidate">;

export type TextareaFieldConfig<
  FormValues,
  FieldName extends keyof FormValues,
> = BaseFieldConfig<FormValues, FieldName, "textarea"> & {
  rows?: number;
};

export type SelectFieldConfig<
  FormValues,
  FieldName extends keyof FormValues,
> = BaseFieldConfig<FormValues, FieldName, "select"> & {
  options: Array<{ label: string; value: string }>;
};

export type SwaggerEndpointSelectorFieldConfig<
  FormValues,
  FieldName extends keyof FormValues,
> = BaseFieldConfig<FormValues, FieldName, "swagger_endpoint_selector"> & {
  endpoints: SwaggerEndpoint[];
  emptyText?: string;
};

export type CheckboxFieldConfig<
  FormValues,
  FieldName extends keyof FormValues,
> = Omit<BaseFieldConfig<FormValues, FieldName, "checkbox">, "placeholder">;

export type DatePickerFieldConfig<
  FormValues,
  FieldName extends keyof FormValues,
> = Omit<
  BaseFieldConfig<FormValues, FieldName, "date_picker">,
  "placeholder"
> & {
  disabled?: (date: Date) => boolean;
};

export type DateRangePickerFieldConfig<
  FormValues,
  FieldName extends keyof FormValues,
> = Omit<
  BaseFieldConfig<FormValues, FieldName, "date_range_picker">,
  "placeholder"
> & {
  disabled?: (date: Date) => boolean;
};

export type FormFieldConfig<
  FormValues,
  FieldName extends keyof FormValues,
  CustomFields = never,
> =
  | InputFieldConfig<FormValues, FieldName>
  | PasswordFieldConfig<FormValues, FieldName>
  | TextareaFieldConfig<FormValues, FieldName>
  | SwaggerEndpointSelectorFieldConfig<FormValues, FieldName>
  | SelectFieldConfig<FormValues, FieldName>
  | CheckboxFieldConfig<FormValues, FieldName>
  | DatePickerFieldConfig<FormValues, FieldName>
  | DateRangePickerFieldConfig<FormValues, FieldName>
  | HiddenFieldConfig
  | CustomFields;
