import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldArraySection } from "@/components/forms/field-array-section";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateInquiryProcessSubtaskFormInput } from "@/features/subtasks/forms/inquiry-process-subtask/create-inquiry-process-subtask-form-schema";

type Props = {
  fieldNames: FieldNamesType<
    FormFieldsType<CreateInquiryProcessSubtaskFormInput>
  >;
};

export const CreateInquiryProcessSubtaskFormFields = ({
  fieldNames,
}: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.subtaskName} />
      <DynamicFormField fieldName={fieldNames.inquiryRoute} />
      <StepsFields fieldNames={fieldNames} />
      <ProgressBarFields fieldNames={fieldNames} />
    </div>
  );
};

const StepsFields = ({ fieldNames }: Props) => {
  return (
    <FieldArraySection
      arrayFieldName={fieldNames.steps.fieldName}
      arrayFieldConfig={fieldNames.steps}
      defaultItem={{
        name: "",
        routeName: "",
        title: "",
        description: "",
      }}
      itemLabel="Step"
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.name)} />
          <DynamicFormField fieldName={buildFieldName(fields.routeName)} />
          <DynamicFormField fieldName={buildFieldName(fields.title)} />
          <DynamicFormField fieldName={buildFieldName(fields.description)} />
        </>
      )}
    </FieldArraySection>
  );
};

const ProgressBarFields = ({ fieldNames }: Props) => {
  return (
    <FieldArraySection
      arrayFieldName={fieldNames.progressBar.fieldName}
      arrayFieldConfig={fieldNames.progressBar}
      defaultItem={{
        groupTitle: "",
      }}
      itemLabel="Progress Bar Group"
    >
      {({ buildFieldName, fieldNames: fields }) => (
        <>
          <DynamicFormField fieldName={buildFieldName(fields.groupTitle)} />
        </>
      )}
    </FieldArraySection>
  );
};
