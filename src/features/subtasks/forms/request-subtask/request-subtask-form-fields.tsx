"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { FieldArraySection } from "@/components/forms/field-array-section";
import { CreateRequestSubtaskFormInput } from "@/features/subtasks/forms/request-subtask/request-subtask-form-schema";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateRequestSubtaskFormInput>>;
};

export const RequestSubtaskFormFields = ({ fieldNames }: Props) => {
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
        resultSchema: false,
      }}
      itemLabel="Request"
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.endpoint)} />
          <DynamicFormField fieldName={buildFieldName(fields.requestType)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
            <DynamicFormField fieldName={buildFieldName(fields.paginated)} />
            <DynamicFormField fieldName={buildFieldName(fields.protected)} />
            <DynamicFormField fieldName={buildFieldName(fields.resultSchema)} />
          </div>
        </>
      )}
    </FieldArraySection>
  );
};
