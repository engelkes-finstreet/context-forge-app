import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { CommonVisualFields } from "./common-visual-fields";
import { FieldArraySection } from "@/components/forms/field-array-section";

type Props = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const SelectFields = ({ index, fieldNames }: Props) => {
  return (
    <>
      <FieldSet>
        <FieldLegend className="text-base font-semibold mb-4">
          Field Properties
        </FieldLegend>
        <CommonVisualFields index={index} fieldNames={fieldNames} />
      </FieldSet>
      <FieldSet>
        <FieldLegend className="text-base font-semibold mb-4">
          Select Configuration
        </FieldLegend>
        <FieldArraySection
          arrayFieldName={`${fieldNames.fields.fieldName}.${index}.selectItems`}
          arrayFieldConfig={{
            fieldName: `${fieldNames.fields.fieldName}.${index}.selectItems`,
            fields: {
              label: "label",
              value: "value",
            },
          }}
          defaultItem={{ label: "", value: "" }}
          itemLabel="Option"
          variant="compact"
          sectionTitle="Options"
        >
          {({ buildFieldName, fieldNames: fields }) => (
            <>
              <DynamicFormField
                fieldName={buildFieldName(fields.label) as any}
              />
              <DynamicFormField
                fieldName={buildFieldName(fields.value) as any}
              />
            </>
          )}
        </FieldArraySection>
      </FieldSet>
    </>
  );
};
