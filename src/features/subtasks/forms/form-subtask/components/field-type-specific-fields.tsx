import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";
import { useWatch } from "react-hook-form";
import { InputFields } from "./input-fields";
import { SelectableCardFields } from "./selectable-card-fields";

type FieldTypeSpecificFieldsProps = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const FieldTypeSpecificFields = ({
  index,
  fieldNames,
}: FieldTypeSpecificFieldsProps) => {
  const watch = useWatch({
    name: `${fieldNames.fields.fieldName}.${index}.${fieldNames.fields.fields.fieldType}`,
  });

  return (
    <>
      {watch === "input" && (
        <InputFields index={index} fieldNames={fieldNames} />
      )}
      {watch === "selectable-card" && (
        <SelectableCardFields index={index} fieldNames={fieldNames} />
      )}
    </>
  );
};
