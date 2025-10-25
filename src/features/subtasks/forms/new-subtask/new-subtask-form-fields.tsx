"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { NewSubtaskFormInput } from "@/features/subtasks/forms/new-subtask/new-subtask-form-schema";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<NewSubtaskFormInput>>;
};

export const NewSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.featureName} />
      <DynamicFormField fieldName={fieldNames.product} />
      <DynamicFormField fieldName={fieldNames.role} />
      <DynamicFormField fieldName={fieldNames.subtaskType} />
    </div>
  );
};
