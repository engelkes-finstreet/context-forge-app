import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldArraySection } from "@/components/forms/field-array-section/field-array-section";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateModalSubtaskFormInput } from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-schema";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateModalSubtaskFormInput>>;
};

export const ModalSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.modalName} />
      <DataTypeFields fieldNames={fieldNames} />
      <DynamicFormField fieldName={fieldNames.metadata.withOpenButton} />
      <DynamicFormField fieldName={fieldNames.metadata.contentDescription} />
    </div>
  );
};

export const DataTypeFields = ({ fieldNames }: Props) => {
  return (
    <FieldArraySection
      arrayFieldName={fieldNames.metadata.dataTypes.fieldName}
      arrayFieldConfig={fieldNames.metadata.dataTypes}
      defaultItem={{
        keyName: "",
        dataType: "",
      }}
      itemLabel="Data Type"
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.keyName)} />
          <DynamicFormField fieldName={buildFieldName(fields.dataType)} />
        </>
      )}
    </FieldArraySection>
  );
};
