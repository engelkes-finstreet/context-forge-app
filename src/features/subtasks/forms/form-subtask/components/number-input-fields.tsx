import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { CommonVisualFields } from "./common-visual-fields";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/types/form-subtask-types";

type Props = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const NumberInputFields = ({ index, fieldNames }: Props) => {
  return (
    <>
      <FieldSet>
        <FieldLegend className="text-base font-semibold mb-4">
          Field Properties
        </FieldLegend>
        <CommonVisualFields index={index} fieldNames={fieldNames} />
      </FieldSet>
      <FieldSet>
        <FieldLegend className="text-base font-semibold mb-4">
          Input Configuration
        </FieldLegend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DynamicFormField
            fieldName={`${fieldNames.fields.fieldName}.${index}.suffix` as any}
          />
          <DynamicFormField
            fieldName={`${fieldNames.fields.fieldName}.${index}.decimal` as any}
          />
        </div>
      </FieldSet>
    </>
  );
};
