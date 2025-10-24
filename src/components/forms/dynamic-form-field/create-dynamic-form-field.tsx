"use client";

import {
  BaseField,
  FormFieldConfig,
} from "@/components/forms/dynamic-form-field/types";
import { FormInput } from "@/components/forms/fields/form-input";
import { FormPasswordInput } from "@/components/forms/fields/form-password-input";
import { FormTextarea } from "@/components/forms/fields/form-textarea";
import { FormSelect } from "@/components/forms/fields/form-select";
import { FormCheckbox } from "@/components/forms/fields/form-checkbox";
import { FormDatePicker } from "@/components/forms/fields/form-date-picker";
import { FormDateRangePicker } from "@/components/forms/fields/form-date-range-picker";
import { useFormConfig } from "@/components/forms/form";
import { getFormFieldConfig } from "@/components/forms/utils/get-form-field-config";
import React from "react";

import { useWatch } from "react-hook-form";
import { FormSwaggerEndpointSelector } from "@/components/forms/fields";

type FieldComponentProps = {
  name: string;
  fieldConfig: any;
};

type CustomComponents = Partial<
  Record<string, React.ComponentType<FieldComponentProps>>
>;

// Default components
const defaultComponents: Partial<
  Record<BaseField, React.ComponentType<FieldComponentProps>>
> = {
  [BaseField.INPUT]: FormInput,
  [BaseField.PASSWORD]: FormPasswordInput,
  [BaseField.TEXTAREA]: FormTextarea,
  [BaseField.SELECT]: FormSelect,
  [BaseField.SWAGGER_ENDPOINT_SELECTOR]: FormSwaggerEndpointSelector,
  [BaseField.CHECKBOX]: FormCheckbox,
  [BaseField.DATE_PICKER]: FormDatePicker,
  [BaseField.DATE_RANGE_PICKER]: FormDateRangePicker,
};

// Factory function to create DynamicFormField with custom components
export const createDynamicFormField = (
  customComponents: CustomComponents = {},
) => {
  const components = { ...defaultComponents, ...customComponents } as Record<
    string,
    React.ComponentType<FieldComponentProps>
  >;

  return function DynamicFormField({
    fieldName,
    fieldConfig,
  }: {
    fieldName: string;
    fieldConfig?: FormFieldConfig<any, any>;
  }) {
    const formConfig = useFormConfig();
    const config =
      fieldConfig || getFormFieldConfig(fieldName, formConfig.fields);
    const formValues = useWatch();

    if (!("type" in config)) {
      throw new Error(`Field ${fieldName} is not a FormFieldConfig`);
    }

    const formFieldConfig = config as FormFieldConfig<any, any>;
    const Component = components[formFieldConfig.type as any];

    if (!Component) {
      throw new Error(`Unknown field type: ${formFieldConfig.type}`);
    }

    if (formFieldConfig.type !== "hidden") {
      if (formFieldConfig.renderCondition) {
        if (!formFieldConfig.renderCondition(formValues)) {
          return null;
        }
      }

      return <Component fieldConfig={config} name={fieldName} />;
    }

    return null;
  };
};
