"use client";

import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/form-subtask-form-schema";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FieldArrayAccordion } from "@/components/forms/field-array-accordion";
import { useWatch } from "react-hook-form";
import { FieldTypeSpecificFields } from "./components/field-type-specific-fields";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateFormSubtaskFormInput>>;
};

type FieldItem = {
  fieldType: string;
  name: string;
  label?: string;
  [key: string]: any;
};

const FIELD_TYPE_COLORS: Record<string, string> = {
  input: "bg-blue-500 hover:bg-blue-600",
  password: "bg-purple-500 hover:bg-purple-600",
  textarea: "bg-green-500 hover:bg-green-600",
  number: "bg-yellow-500 hover:bg-yellow-600",
  datepicker: "bg-pink-500 hover:bg-pink-600",
  checkbox: "bg-indigo-500 hover:bg-indigo-600",
  "radio-group": "bg-orange-500 hover:bg-orange-600",
  "yes-no-radio": "bg-teal-500 hover:bg-teal-600",
  select: "bg-cyan-500 hover:bg-cyan-600",
  combobox: "bg-violet-500 hover:bg-violet-600",
  "selectable-card": "bg-fuchsia-500 hover:bg-fuchsia-600",
  hidden: "bg-gray-500 hover:bg-gray-600",
};

export const FormSubtaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.subtaskName} />
      <DynamicFormField fieldName={fieldNames.metadata.additionalDetails} />
      <Fields fieldNames={fieldNames} />
    </div>
  );
};

const FieldSummary = ({
  index,
  arrayFieldName,
}: {
  index: number;
  arrayFieldName: string;
}) => {
  const field = useWatch({
    name: `${arrayFieldName}.${index}`,
  }) as FieldItem | undefined;

  const fieldType = field?.fieldType;
  const fieldName = field?.name;
  const fieldLabel = field?.label;

  // Format field type for display
  const displayFieldType = fieldType
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      {fieldType ? (
        <>
          <Badge
            className={cn(
              "text-white text-xs font-semibold shadow-sm",
              FIELD_TYPE_COLORS[fieldType] || "bg-gray-500",
            )}
          >
            {displayFieldType}
          </Badge>
          {fieldName && (
            <span className="text-sm font-mono truncate dark:text-foreground/90">
              {fieldName}
            </span>
          )}
          {fieldLabel && (
            <>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-sm truncate dark:text-foreground/80">
                {fieldLabel}
              </span>
            </>
          )}
        </>
      ) : (
        <span className="text-sm text-muted-foreground italic">
          Not configured
        </span>
      )}
    </div>
  );
};

export const Fields = ({ fieldNames }: Props) => {
  return (
    <FieldArrayAccordion
      arrayFieldName={fieldNames.metadata.fields.fieldName}
      arrayFieldConfig={fieldNames.metadata.fields}
      defaultItem={{
        fieldType: "input",
        name: "",
        label: "",
        description: "",
        validation: "",
        placeholder: "",
        suffix: "none",
      }}
      itemLabel="Field"
      sectionTitle="Fields"
      renderSummary={({ index }) => (
        <FieldSummary
          index={index}
          arrayFieldName={fieldNames.metadata.fields.fieldName}
        />
      )}
    >
      {({ index, fieldNames: fields, buildFieldName }) => (
        <div className="space-y-6">
          <DynamicFormField fieldName={buildFieldName(fields.fieldType)} />
          <DynamicFormField fieldName={buildFieldName(fields.name)} />
          <FieldTypeSpecificFields index={index} fieldNames={fieldNames} />
        </div>
      )}
    </FieldArrayAccordion>
  );
};
