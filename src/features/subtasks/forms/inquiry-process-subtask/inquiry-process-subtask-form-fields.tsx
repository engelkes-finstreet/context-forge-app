"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldArraySection } from "@/components/forms/field-array-section";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateInquiryProcessSubtaskFormInput } from "@/features/subtasks/forms/inquiry-process-subtask/inquiry-process-subtask-form-schema";

type Props = {
  fieldNames: FieldNamesType<
    FormFieldsType<CreateInquiryProcessSubtaskFormInput>
  >;
};

export const InquiryProcessSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.subtaskName} />
      <DynamicFormField fieldName={fieldNames.metadata.inquiryRoute} />
      <StepsFields fieldNames={fieldNames} />
      <ProgressBarFields fieldNames={fieldNames} />
    </div>
  );
};

export const StepsFields = ({ fieldNames }: Props) => {
  return (
    <FieldArraySection
      arrayFieldName={fieldNames.metadata.steps.fieldName}
      arrayFieldConfig={fieldNames.metadata.steps}
      defaultItem={{
        name: "",
        routeName: "",
        title: "",
        description: "",
      }}
      itemLabel="Step"
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.name)} />
          <DynamicFormField fieldName={buildFieldName(fields.routeName)} />
          <DynamicFormField fieldName={buildFieldName(fields.title)} />
          <DynamicFormField fieldName={buildFieldName(fields.description)} />
        </>
      )}
    </FieldArraySection>
  );
};

export const ProgressBarFields = ({ fieldNames }: Props) => {
  return (
    <FieldArraySection
      arrayFieldName={fieldNames.metadata.progressBar.fieldName}
      arrayFieldConfig={fieldNames.metadata.progressBar}
      defaultItem={{
        groupTitle: "",
      }}
      itemLabel="Progress Bar Group"
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.groupTitle)} />
        </>
      )}
    </FieldArraySection>
  );
};
