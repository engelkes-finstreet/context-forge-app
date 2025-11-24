import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldArraySection } from "@/components/forms/field-array-section/field-array-section";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateModalSubtaskFormInput } from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-schema";
import { FieldSet, FieldLegend } from "@/components/ui/field";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateModalSubtaskFormInput>>;
};

export const ModalSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <FieldSet>
        <FieldLegend>Basic Information</FieldLegend>
        <DynamicFormField fieldName={fieldNames.modalName} />
      </FieldSet>

      <FieldSet>
        <FieldLegend>Data Types</FieldLegend>
        <DataTypeFields fieldNames={fieldNames} />
      </FieldSet>

      <FieldSet>
        <FieldLegend>Modal Configuration</FieldLegend>
        <DynamicFormField fieldName={fieldNames.metadata.withOpenButton} />
        <DynamicFormField fieldName={fieldNames.metadata.contentDescription} />
      </FieldSet>

      <FieldSet>
        <FieldLegend>Translations</FieldLegend>
        <DynamicFormField fieldName={fieldNames.metadata.translations.title} />
        <DynamicFormField
          fieldName={fieldNames.metadata.translations.subheading}
        />
        <DynamicFormField
          fieldName={fieldNames.metadata.translations.confirmButton}
        />
      </FieldSet>
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
        <div className="grid grid-cols-2 gap-4">
          <DynamicFormField fieldName={buildFieldName(fields.keyName)} />
          <DynamicFormField fieldName={buildFieldName(fields.dataType)} />
        </div>
      )}
    </FieldArraySection>
  );
};
