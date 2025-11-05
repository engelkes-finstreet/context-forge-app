import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/form-subtask-form-schema";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { CommonVisualFields } from "./common-visual-fields";

type Props = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const DatePickerFields = ({ index, fieldNames }: Props) => {
  return (
    <>
      <FieldSet>
        <FieldLegend className="text-base font-semibold mb-4">
          Field Properties
        </FieldLegend>
        <CommonVisualFields index={index} fieldNames={fieldNames} />
      </FieldSet>
    </>
  );
};
