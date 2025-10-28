import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { OptionsFields } from "./options-fields";
import { CommonVisualFields } from "./common-visual-fields";

type SelectableCardFieldsProps = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const SelectableCardFields = ({
  index,
  fieldNames,
}: SelectableCardFieldsProps) => {
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
          Selectable Card Configuration
        </FieldLegend>
        <DynamicFormField
          fieldName={`${fieldNames.fields.fieldName}.${index}.multiSelect` as any}
        />
        <OptionsFields index={index} fieldNames={fieldNames} />
      </FieldSet>
    </>
  );
};
