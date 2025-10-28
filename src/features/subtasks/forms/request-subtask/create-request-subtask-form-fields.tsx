"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { FieldArraySection } from "@/components/forms/field-array-section";
import { CreateRequestSubtaskFormInput } from "@/features/subtasks/forms/request-subtask/create-request-subtask-form-schema";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateRequestSubtaskFormInput>>;
};

export const CreateRequestSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.subtaskName} />
      <RequestsFields fieldNames={fieldNames} />
    </div>
  );
};

export const RequestsFields = ({ fieldNames }: Props) => {
  return (
    <FieldArraySection
      arrayFieldName={fieldNames.requests.fieldName}
      arrayFieldConfig={fieldNames.requests}
      defaultItem={{
        endpoint: "",
        requestType: undefined,
        paginated: false,
        protected: false,
      }}
      itemLabel="Request"
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.endpoint)} />
          <DynamicFormField fieldName={buildFieldName(fields.requestType)} />
          <DynamicFormField fieldName={buildFieldName(fields.paginated)} />
          <DynamicFormField fieldName={buildFieldName(fields.protected)} />
        </>
      )}
    </FieldArraySection>
  );
};
