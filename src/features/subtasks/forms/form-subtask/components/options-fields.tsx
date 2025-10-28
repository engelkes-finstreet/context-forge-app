import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";
import { PlusIcon, XIcon } from "lucide-react";

type OptionsFieldsProps = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const OptionsFields = ({ index, fieldNames }: OptionsFieldsProps) => {
  const {
    fields: optionsArray,
    append,
    remove,
    update,
  } = useFieldArray({
    name: `${fieldNames.fields.fieldName}.${index}.options`,
  });

  const handleRemove = (optionIndex: number) => {
    if (optionsArray.length <= 1) {
      update(optionIndex, { label: "", sublabel: "" });
    } else {
      remove(optionIndex);
    }
  };

  const handleAdd = () => {
    append({ label: "", sublabel: "" });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold">Options</div>
      <div className="space-y-3">
        {optionsArray.map((option, optionIndex) => (
          <div
            key={option.id}
            className="border border-primary/30 rounded-md overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2">
              <h4 className="text-sm font-medium">Option {optionIndex + 1}</h4>
              <Button
                onClick={() => handleRemove(optionIndex)}
                variant="ghost"
                size="icon"
                type="button"
                aria-label={`Remove Option ${optionIndex + 1}`}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
            <div className="p-4 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                <DynamicFormField
                  fieldName={`${fieldNames.fields.fieldName}.${index}.options.${optionIndex}.label` as any}
                />
                <DynamicFormField
                  fieldName={`${fieldNames.fields.fieldName}.${index}.options.${optionIndex}.sublabel` as any}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleAdd}
          variant="outline"
          size="sm"
          className="border-dashed"
          type="button"
        >
          <PlusIcon className="size-4 mr-2" />
          Add Option
        </Button>
      </div>
    </div>
  );
};
