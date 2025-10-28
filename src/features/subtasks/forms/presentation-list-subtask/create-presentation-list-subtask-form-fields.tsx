import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { Button } from "@/components/ui/button";
import { CreatePresentationListSubtaskFormInput } from "@/features/subtasks/forms/presentation-list-subtask/create-presentation-list-subtask-form-schema";
import { XIcon, PlusIcon, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormState } from "react-hook-form";

type Props = {
  fieldNames: FieldNamesType<
    FormFieldsType<CreatePresentationListSubtaskFormInput>
  >;
};

export const CreatePresentationListSubtaskFormFields = ({
  fieldNames,
}: Props) => {
  const { errors } = useFormState();
  const columnsError = errors.columns?.root?.message?.toString();

  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.subtaskName} />
      {columnsError && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="size-4 shrink-0" />
          <span>{columnsError}</span>
        </div>
      )}
      <ColumnsFields fieldNames={fieldNames} />
      <DynamicFormField fieldName={fieldNames.noItemTranslation} />
    </div>
  );
};

const ColumnsFields = ({ fieldNames }: Props) => {
  const {
    fields: fieldsArray,
    append,
    remove,
    update,
  } = useFieldArray({
    name: fieldNames.columns.fieldName,
  });

  useEffect(() => {
    if (fieldsArray.length === 0) {
      append({
        name: "",
        translation: "",
        gridTemplateColumns: undefined,
      });
    }
  }, [fieldsArray, append]);

  const handleRemove = (index: number) => {
    if (fieldsArray.length === 1) {
      update(index, {
        name: "",
        translation: "",
        gridTemplateColumns: undefined,
      });
    }
    remove(index);
  };

  const handleAdd = () => {
    append({
      name: "",
      translation: "",
      gridTemplateColumns: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {fieldsArray.map((field, index) => (
          <div
            key={field.id}
            className="border border-primary/50 rounded-md overflow-hidden"
          >
            <div className="flex items-center justify-between bg-muted px-4 py-2">
              <h3 className="text-sm font-medium">Column {index + 1}</h3>
              <Button
                onClick={() => handleRemove(index)}
                variant="ghost"
                size="icon"
                type="button"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-6 p-4">
              <DynamicFormField
                fieldName={`${fieldNames.columns.fieldName}.${index}.${fieldNames.columns.fields.name}`}
              />
              <DynamicFormField
                fieldName={`${fieldNames.columns.fieldName}.${index}.${fieldNames.columns.fields.translation}`}
              />
              <DynamicFormField
                fieldName={`${fieldNames.columns.fieldName}.${index}.${fieldNames.columns.fields.gridTemplateColumns}`}
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={handleAdd}
        variant="outline"
        className="w-full border-dashed"
        type="button"
      >
        <PlusIcon className="size-4 mr-2" />
        Add Request
      </Button>
    </div>
  );
};
