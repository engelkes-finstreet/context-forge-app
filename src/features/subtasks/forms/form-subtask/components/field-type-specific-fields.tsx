import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { useWatch } from "react-hook-form";
import { InputFields } from "./input-fields";
import { SelectableCardFields } from "./selectable-card-fields";
import { HiddenFields } from "./hidden-fields";
import { NumberInputFields } from "@/features/subtasks/forms/form-subtask/components/number-input-fields";
import { TextAreaFields } from "@/features/subtasks/forms/form-subtask/components/text-area-fields";
import { PasswordFields } from "@/features/subtasks/forms/form-subtask/components/password-fields";
import { DatePickerFields } from "@/features/subtasks/forms/form-subtask/components/date-picker-fields";
import { SelectFields } from "@/features/subtasks/forms/form-subtask/components/select-fields";
import { RadioFields } from "@/features/subtasks/forms/form-subtask/components/radio-fields";
import { YesNoRadioFields } from "@/features/subtasks/forms/form-subtask/components/yes-no-radio-fields";
import { CheckboxFields } from "@/features/subtasks/forms/form-subtask/components/checkbox-fields";
import { ComboboxFields } from "@/features/subtasks/forms/form-subtask/components/combobox-fields";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/form-subtask-form-schema";

type FieldTypeSpecificFieldsProps = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const FieldTypeSpecificFields = ({
  index,
  fieldNames,
}: FieldTypeSpecificFieldsProps) => {
  const fieldType = useWatch({
    name: `${fieldNames.metadata.fields.fieldName}.${index}.${fieldNames.metadata.fields.fields.fieldType}`,
  });

  switch (fieldType) {
    case "input":
      return <InputFields index={index} fieldNames={fieldNames} />;
    case "selectable-card":
      return <SelectableCardFields index={index} fieldNames={fieldNames} />;
    case "number":
      return <NumberInputFields index={index} fieldNames={fieldNames} />;
    case "textarea":
      return <TextAreaFields index={index} fieldNames={fieldNames} />;
    case "password":
      return <PasswordFields index={index} fieldNames={fieldNames} />;
    case "datepicker":
      return <DatePickerFields index={index} fieldNames={fieldNames} />;
    case "select":
      return <SelectFields index={index} fieldNames={fieldNames} />;
    case "radio-group":
      return <RadioFields index={index} fieldNames={fieldNames} />;
    case "yes-no-radio":
      return <YesNoRadioFields index={index} fieldNames={fieldNames} />;
    case "checkbox":
      return <CheckboxFields index={index} fieldNames={fieldNames} />;
    case "combobox":
      return <ComboboxFields index={index} fieldNames={fieldNames} />;
    case "hidden":
      return <HiddenFields />;
    default:
      return null;
  }
};
