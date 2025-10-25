"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { Button } from "@/components/ui/button";
import { CreateRequestSubtaskFormInput } from "@/features/subtasks/components/forms/request-subtask/create-request-subtask-form-schema";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateRequestSubtaskFormInput>>;
};

export const CreateRequestSubtaskFormFields = ({ fieldNames }: Props) => {
  // Get errors from react-hook-form context
  const {
    formState: { errors },
  } = useFormContext();

  console.log({ errors });
  return (
    <div className="space-y-6">
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
        protected: undefined,
      });
    }
  }, [fieldsArray, append]);

  const handleRemove = (index: number) => {
    if (fieldsArray.length === 1) {
      update(index, {
        endpoint: "",
        requestType: undefined,
        paginated: undefined,
        protected: undefined,
      });
    }

    remove(index);
  };

  const handleAdd = () => {
    append({
      endpoint: "",
      requestType: undefined,
      paginated: undefined,
      protected: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {fieldsArray.map((field, index) => (
          <div
            key={field.id}
            className="border border-primary/50 rounded-md overflow-hidden"
          >
            <div className="flex items-center justify-between bg-muted px-4 py-2">
              <h3 className="text-sm font-medium">Request {index + 1}</h3>
              <Button
                onClick={() => handleRemove(index)}
                variant="ghost"
                size="icon"
                type="button"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-6 p-4">
              <DynamicFormField
                fieldName={`${fieldNames.requests.fieldName}.${index}.${fieldNames.requests.fields.endpoint}`}
              />
              <DynamicFormField
                fieldName={`${fieldNames.requests.fieldName}.${index}.${fieldNames.requests.fields.requestType}`}
              />
              <DynamicFormField
                fieldName={`${fieldNames.requests.fieldName}.${index}.${fieldNames.requests.fields.paginated}`}
              />
              <DynamicFormField
                fieldName={`${fieldNames.requests.fieldName}.${index}.${fieldNames.requests.fields.protected}`}
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={handleAdd}
        variant="outline"
        className="w-full border-dashed"
        type="button"
      >
        <PlusIcon className="size-4 mr-2" />
        Add Request
      </Button>
    </div>
  );
};
