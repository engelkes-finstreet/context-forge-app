import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldSet, FieldLegend } from "@/components/ui/field";

type InputFieldsProps = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const InputFields = ({ index, fieldNames }: InputFieldsProps) => {
  return (
    <FieldSet>
      <FieldLegend className="text-base font-semibold mb-4">
        Input Configuration
      </FieldLegend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DynamicFormField
          fieldName={`${fieldNames.fields.fieldName}.${index}.inputType`}
        />
        <DynamicFormField
          fieldName={`${fieldNames.fields.fieldName}.${index}.placeholder`}
        />
      </div>
    </FieldSet>
  );
};
