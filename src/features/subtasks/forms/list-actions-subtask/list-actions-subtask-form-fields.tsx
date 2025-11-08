import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldArraySection } from "@/components/forms/field-array-section";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateListActionsSubtaskFormInput } from "@/features/subtasks/forms/list-actions-subtask/list-actions-subtask-form-schema";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateListActionsSubtaskFormInput>>;
};

export const ListActionsSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.listActionsName} />
      <DynamicFormField fieldName={fieldNames.metadata.pagePath} />
      <DynamicFormField fieldName={fieldNames.metadata.withSearch} />
      <DynamicFormField fieldName={fieldNames.metadata.withSort} />
      <DynamicFormField fieldName={fieldNames.metadata.withGrouping} />
      <InteractiveListsFields fieldNames={fieldNames} />
    </div>
  );
};

const InteractiveListsFields = ({ fieldNames }: Props) => {
  return (
    <FieldArraySection
      arrayFieldName={fieldNames.metadata.interactiveLists.fieldName}
      arrayFieldConfig={fieldNames.metadata.interactiveLists}
      defaultItem={{
        swaggerPath: "",
        name: "",
      }}
      itemLabel="Interactive List"
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.swaggerPath)} />
          <DynamicFormField fieldName={buildFieldName(fields.name)} />
        </>
      )}
    </FieldArraySection>
  );
};
