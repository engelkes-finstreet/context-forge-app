import { DeepPartial, FieldValues } from "react-hook-form";
import { ZodTypeAny } from "zod";

import { FormFieldConfig } from "@/components/forms/dynamic-form-field/types";

export type FormState = {
  error: string | null;
  message: string | null;
} | null;

export type FormConfig<
  State extends FormState,
  FormInput extends FieldValues,
  FormOutput extends FieldValues = FormInput,
  CustomFields = never,
> = {
  schema: ZodTypeAny;
  fields: FormFieldsType<FormInput, CustomFields>;
  fieldNames: FieldNamesType<FormFieldsType<FormInput, CustomFields>>;
  defaultValues: DeepPartial<FormInput>;
  serverAction: (
    prevState: State | null,
    formValues: FormOutput,
  ) => Promise<State>;
  useErrorAction?: () => (state: State) => void;
  useSuccessAction?: () => (state: State) => void;
  renderFormActions: (isPending: boolean) => React.ReactNode;
  hideActions?: boolean;
  formId?: string;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
};

export type ClientFormConfig<
  FormInput extends FieldValues,
  FormOutput extends FieldValues = FormInput,
  CustomFields = never,
> = {
  schema: ZodTypeAny;
  fields: FormFieldsType<FormInput, CustomFields>;
  fieldNames: FieldNamesType<FormFieldsType<FormInput, CustomFields>>;
  defaultValues: DeepPartial<FormInput>;
  onSubmit: (formValues: FormOutput) => Promise<void> | void;
  renderFormActions: (isPending: boolean) => React.ReactNode;
  hideActions?: boolean;
  formId?: string;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
};

export type ArrayFieldConfig<
  T,
  RootFormValues,
  CustomFields = never,
> = {
  type: "array";
} & {
  [field in keyof T]: T[field] extends readonly any[]
    ? // If this nested field is also an array of objects
      T[field][number] extends object
      ? // Check if it's a Date array
        T[field][number] extends Date
        ? FormFieldConfig<RootFormValues, keyof RootFormValues & string, CustomFields>
        : ArrayFieldConfig<T[field][number], RootFormValues, CustomFields>
      : // Array of primitives
        FormFieldConfig<RootFormValues, keyof RootFormValues & string, CustomFields>
    : // If it's a Date
      T[field] extends Date
      ? FormFieldConfig<RootFormValues, keyof RootFormValues & string, CustomFields>
      : // If it's a nested object (not array or Date)
        T[field] extends object
        ? FormFieldsType<T[field], CustomFields, RootFormValues>
        : // Otherwise, scalar field
          FormFieldConfig<RootFormValues, keyof RootFormValues & string, CustomFields>;
};

type Strict<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};
/**
 This type transformation allows us to differentiate between arrays of primitive types (like strings)
 and arrays of objects within the form schema. The purpose is to apply different configurations
 based on the type of array elements. Specifically, we want to use `ArrayFieldConfig` for arrays of objects
 and `FieldConfig` for arrays of strings and other individual fields.

 The `Fields` type uses conditional types to achieve this:
 - `FormValues[field] extends readonly any[]`: Checks if the field is an array.
 - `FormValues[field][number] extends object`: If the field is an array, this checks if the elements
 of the array are objects. If true, it means the array contains objects, and we apply `ArrayFieldConfig`.
 - `: FieldConfig<FormValues, field>`: If the field is not an array or if it's an array of primitives (like strings),
 we apply `FieldConfig`.

 This differentiation is crucial for properly handling form configurations where arrays of objects
 may require different validation and processing logic compared to arrays of strings or other individual fields.
 **/
/**
 * For each property of `FormValues`:
 * 1. If it is an array of objects, we use `ArrayFieldConfig` (e.g. for z.array(z.object({...}))).
 * 2. If it is an array of primitives, we use `FormFieldConfig`.
 * 3. If it is a Date, we use `FormFieldConfig` (dates are treated as scalar fields).
 * 4. If it is a nested object (not an array or Date), we recurse and create a nested `FormFieldsType`.
 * 5. Otherwise, we use a normal `FormFieldConfig` (e.g., string, number, etc.).
 */
export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? K | `${K & string}.${NestedKeyOf<T[K]> & string}`
        : K;
    }[keyof T]
  : never;

export type FormFieldsType<
  FormValues,
  CustomFields = never,
  RootFormValues = FormValues,
> = {
  [field in keyof Strict<FormValues>]: Strict<FormValues>[field] extends readonly any[] // 1. If `field` is an array
    ? // 1a. If array elements are objects => ArrayFieldConfig
      Strict<FormValues>[field][number] extends object
      ? // Check if it's a Date array
        Strict<FormValues>[field][number] extends Date
        ? FormFieldConfig<
            RootFormValues,
            keyof RootFormValues & string,
            CustomFields
          >
        : ArrayFieldConfig<
            Strict<FormValues>[field][number],
            RootFormValues,
            CustomFields
          >
      : // 1b. Otherwise (array of primitives) => FormFieldConfig
        FormFieldConfig<
          RootFormValues,
          keyof RootFormValues & string,
          CustomFields
        >
    : // 2. If `field` is a Date => treat as scalar field config
      Strict<FormValues>[field] extends Date
      ? FormFieldConfig<
          RootFormValues,
          keyof RootFormValues & string,
          CustomFields
        >
      : // 3. If `field` is an object (and not an array or Date) => recurse
        Strict<FormValues>[field] extends object
        ? FormFieldsType<
            Strict<FormValues>[field],
            CustomFields,
            RootFormValues
          >
        : // 4. Otherwise => scalar field config
          FormFieldConfig<
            RootFormValues,
            keyof RootFormValues & string,
            CustomFields
          >;
};

export type FieldNamesType<F extends FormFieldsType<any, any>> = {
  [K in keyof F]: F[K] extends { type: "array" } // 1) Array field => { fieldName, fields }
    ? {
        fieldName: string;
        fields: FieldNamesType<Omit<F[K], "type">>;
      }
    : // 2) Normal field => string
      F[K] extends { type: unknown }
      ? string
      : // 3) Nested object => recurse
        FieldNamesType<F[K]>;
};
