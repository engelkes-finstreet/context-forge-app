import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { CommonVisualFields } from "./common-visual-fields";
import { FieldArraySection } from "@/components/forms/field-array-section";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/form-subtask-form-schema";

type SelectableCardFieldsProps = {
  index: number;
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

export const SelectableCardFields = ({
  index,
  fieldNames,
}: SelectableCardFieldsProps) => {
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
          Selectable Card Configuration
        </FieldLegend>
        <DynamicFormField
          fieldName={
            `${fieldNames.metadata.fields.fieldName}.${index}.multiSelect` as any
          }
        />
        <FieldArraySection
          arrayFieldName={`${fieldNames.metadata.fields.fieldName}.${index}.options`}
          arrayFieldConfig={{
            fieldName: `${fieldNames.metadata.fields.fieldName}.${index}.options`,
            fields: {
              name: "name",
              label: "label",
              sublabel: "sublabel",
            },
          }}
          defaultItem={{ name: "", label: "", sublabel: "" }}
          itemLabel="Option"
          variant="compact"
          sectionTitle="Options"
          minItems={1}
        >
          {({ buildFieldName, fieldNames: fields }) => (
            <>
              <DynamicFormField
                fieldName={buildFieldName(fields.name) as any}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                <DynamicFormField
                  fieldName={buildFieldName(fields.label) as any}
                />
                <DynamicFormField
                  fieldName={buildFieldName(fields.sublabel) as any}
                />
              </div>
            </>
          )}
        </FieldArraySection>
      </FieldSet>
    </>
  );
};
