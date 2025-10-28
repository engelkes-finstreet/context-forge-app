import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { FieldArraySection } from "@/components/forms/field-array-section";
import { CreatePresentationListSubtaskFormInput } from "@/features/subtasks/forms/presentation-list-subtask/create-presentation-list-subtask-form-schema";
import { AlertCircle } from "lucide-react";
import { useFormState } from "react-hook-form";

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
  return (
    <FieldArraySection
      arrayFieldName={fieldNames.columns.fieldName}
      arrayFieldConfig={fieldNames.columns}
      defaultItem={{
        name: "",
        translation: "",
        gridTemplateColumns: undefined,
      }}
      itemLabel="Column"
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.name)} />
          <DynamicFormField fieldName={buildFieldName(fields.translation)} />
          <DynamicFormField
            fieldName={buildFieldName(fields.gridTemplateColumns)}
          />
        </>
      )}
    </FieldArraySection>
  );
};
