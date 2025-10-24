"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { Button } from "@/components/ui/button";
import { CreateRequestSubtaskFormInput } from "@/features/subtasks/components/forms/request-subtask/create-request-subtask-form-schema";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateRequestSubtaskFormInput>>;
};

export const CreateRequestSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.name} />
      <RequestsFields fieldNames={fieldNames} />
    </div>
  );
};

export const RequestsFields = ({ fieldNames }: Props) => {
  const {
    fields: fieldsArray,
    append,
    remove,
    update,
  } = useFieldArray({
    name: fieldNames.requests.fieldName,
  });

  useEffect(() => {
    if (fieldsArray.length === 0) {
      append({
        endpoint: "",
        requestType: undefined,
        paginated: undefined,
      });
    }
  }, [fieldsArray, append]);

  const handleRemove = (index: number) => {
    if (fieldsArray.length === 1) {
      update(index, {
        endpoint: "",
        requestType: undefined,
        paginated: undefined,
      });
    }

    remove(index);
  };

  const handleAdd = () => {
    append({
      endpoint: "",
      requestType: undefined,
      paginated: undefined,
    });
  };

  return (
    <div>
      <div>
        {fieldsArray.map((field, index) => (
          <div key={field.id}>
            <DynamicFormField
              fieldName={`${fieldNames.requests.fieldName}.${index}.${fieldNames.requests.fields.endpoint}`}
            />
            <DynamicFormField
              fieldName={`${fieldNames.requests.fieldName}.${index}.${fieldNames.requests.fields.requestType}`}
            />
            <DynamicFormField
              fieldName={`${fieldNames.requests.fieldName}.${index}.${fieldNames.requests.fields.paginated}`}
            />
            <Button onClick={() => handleRemove(index)}>Remove</Button>
          </div>
        ))}
      </div>
      <Button onClick={handleAdd}>Add</Button>
    </div>
  );
};
