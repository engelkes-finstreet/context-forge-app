"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreatePageSubtaskFormInput } from "@/features/subtasks/forms/page-subtask/page-subtask-form-schema";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { useWatch } from "react-hook-form";
import { PageType } from "@/features/subtasks/forms/page-subtask/use-page-type-options";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreatePageSubtaskFormInput>>;
};

export const PageSubtaskFormFields = ({ fieldNames }: Props) => {
  const pageType = useWatch({
    name: fieldNames.metadata.pageType,
  });

  const isInquiry = pageType === PageType.INQUIRY;

  return (
    <div className="space-y-6">
      <FieldSet>
        <FieldLegend>Basic Information</FieldLegend>
        <DynamicFormField fieldName={fieldNames.pageName} />
      </FieldSet>

      <FieldSet>
        <FieldLegend>Page Configuration</FieldLegend>
        <DynamicFormField fieldName={fieldNames.metadata.pageType} />
      </FieldSet>

      <FieldSet>
        <FieldLegend>Translations</FieldLegend>
        <DynamicFormField fieldName={fieldNames.metadata.translations.title} />
        {isInquiry && (
          <DynamicFormField
            fieldName={fieldNames.metadata.translations.description}
          />
        )}
      </FieldSet>
    </div>
  );
};
