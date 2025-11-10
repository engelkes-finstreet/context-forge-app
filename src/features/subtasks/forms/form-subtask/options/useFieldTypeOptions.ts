import { SelectOptions } from "@/components/forms/dynamic-form-field/types";

enum FieldTypeOptions {
  INPUT = "input",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  NUMBER = "number",
  DATEPICKER = "datepicker",
  CHECKBOX = "checkbox",
  RADIO_GROUP = "radio-group",
  YES_NO_RADIO = "yes-no-radio",
  SELECT = "select",
  COMBOBOX = "combobox",
  SELECTABLE_CARD = "selectable-card",
  HIDDEN = "hidden",
}

export function useFieldTypeOptions(): SelectOptions {
  return [
    { label: "Input", value: FieldTypeOptions.INPUT },
    { label: "Password", value: FieldTypeOptions.PASSWORD },
    { label: "Textarea", value: FieldTypeOptions.TEXTAREA },
    { label: "Number", value: FieldTypeOptions.NUMBER },
    { label: "Date", value: FieldTypeOptions.DATEPICKER },
    { label: "Checkbox", value: FieldTypeOptions.CHECKBOX },
    { label: "Radio Group", value: FieldTypeOptions.RADIO_GROUP },
    { label: "Yes No Radio", value: FieldTypeOptions.YES_NO_RADIO },
    { label: "Select", value: FieldTypeOptions.SELECT },
    { label: "Combobox", value: FieldTypeOptions.COMBOBOX },
    { label: "Selectable Card", value: FieldTypeOptions.SELECTABLE_CARD },
    { label: "Hidden", value: FieldTypeOptions.HIDDEN },
  ];
}
