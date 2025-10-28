import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { PlusIcon, XIcon } from "lucide-react";
import { FieldTypeSpecificFields } from "./components/field-type-specific-fields";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const CreateFormSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.subtaskName} />
      <Fields fieldNames={fieldNames} />
    </div>
  );
};

export const Fields = ({ fieldNames }: Props) => {
  const {
    fields: fieldsArray,
    append,
    remove,
    update,
  } = useFieldArray({
    name: fieldNames.fields.fieldName,
  });

  useEffect(() => {
    if (fieldsArray.length === 0) {
      append({
        fieldType: "input",
        name: "",
        label: "",
        description: "",
        validation: "",
        inputType: "text",
        placeholder: "",
      });
    }
  }, [fieldsArray, append]);

  const handleRemove = (index: number) => {
    if (fieldsArray.length <= 1) {
      update(index, {});
    } else {
      remove(index);
    }
  };

  const handleAdd = () => {
    append({
      fieldType: "input",
      name: "",
      label: "",
      description: "",
      validation: "",
      inputType: "text",
      placeholder: "",
    });
  };

  return (
    <div className={"space-y-4"}>
      <div className="space-y-4">
        {fieldsArray.map((field, index) => (
          <div
            key={field.id}
            className="border border-primary/50 rounded-md overflow-hidden"
          >
            <div className="flex items-center justify-between bg-muted px-4 py-2">
              <h3 className="text-sm font-medium">Field</h3>
              <Button
                onClick={() => handleRemove(index)}
                variant="ghost"
                size="icon"
                type="button"
                aria-label={`Remove Field ${index + 1}`}
              >
                <XIcon className="size-4" />
              </Button>
            </div>

            <div className="p-4 space-y-8">
              <FieldSet>
                <FieldLegend className="text-base font-semibold mb-4">
                  Base Configuration
                </FieldLegend>
                <DynamicFormField
                  fieldName={`${fieldNames.fields.fieldName}.${index}.${fieldNames.fields.fields.fieldType}`}
                />
                <DynamicFormField
                  fieldName={`${fieldNames.fields.fieldName}.${index}.${fieldNames.fields.fields.name}`}
                />
              </FieldSet>

              <FieldTypeSpecificFields index={index} fieldNames={fieldNames} />
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleAdd}
        variant="secondary"
        className="w-full border-dashed"
        type="button"
      >
        <PlusIcon className="size-4 mr-2" />
        Add Field
      </Button>
    </div>
  );
};
