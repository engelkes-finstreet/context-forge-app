import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";

type CommonVisualFieldsProps = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const CommonVisualFields = ({
  index,
  fieldNames,
}: CommonVisualFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DynamicFormField
          fieldName={`${fieldNames.fields.fieldName}.${index}.label` as any}
        />
        <DynamicFormField
          fieldName={
            `${fieldNames.fields.fieldName}.${index}.validation` as any
          }
        />
        <DynamicFormField
          fieldName={`${fieldNames.fields.fieldName}.${index}.caption` as any}
        />
        <DynamicFormField
          fieldName={
            `${fieldNames.fields.fieldName}.${index}.placeholder` as any
          }
        />
      </div>
      <DynamicFormField
        fieldName={
          `${fieldNames.fields.fieldName}.${index}.renderCondition` as any
        }
      />
    </>
  );
};
