"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateSimpleFormSubtaskFormInput } from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-schema";
import { FieldSet, FieldLegend } from "@/components/ui/field";

type Props = {
  fieldNames: FieldNamesType<
    FormFieldsType<CreateSimpleFormSubtaskFormInput>
  >;
};

export const SimpleFormSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <FieldSet>
        <FieldLegend>Simple Form Configuration</FieldLegend>
        <DynamicFormField fieldName={fieldNames.metadata.simpleFormName} />
        <DynamicFormField fieldName={fieldNames.metadata.swaggerPath} />
        <DynamicFormField fieldName={fieldNames.metadata.description} />
      </FieldSet>
    </div>
  );
};
