import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/form-subtask-form-schema";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { CommonVisualFields } from "./common-visual-fields";
import { FieldArraySection } from "@/components/forms/field-array-section";

type Props = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const RadioFields = ({ index, fieldNames }: Props) => {
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
          Radio Configuration
        </FieldLegend>
        <FieldArraySection
          arrayFieldName={`${fieldNames.metadata.fields.fieldName}.${index}.radioItems`}
          arrayFieldConfig={{
            fieldName: `${fieldNames.metadata.fields.fieldName}.${index}.radioItems`,
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
