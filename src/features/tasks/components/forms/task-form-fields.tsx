import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { FieldNamesType, FormFieldsType } from "@/components/forms/types";
import { CreateTaskInput } from "@/features/tasks/components/forms/task-form-schema";

type Props = {
  fieldNames: FieldNamesType<FormFieldsType<CreateTaskInput>>;
};

export const TaskFormFields = ({ fieldNames }: Props) => {
  return (
    <div className="space-y-6">
      <DynamicFormField fieldName={fieldNames.name} />
      <DynamicFormField fieldName={fieldNames.featureName} />
      <DynamicFormField fieldName={fieldNames.product} />
      <DynamicFormField fieldName={fieldNames.role} />
    </div>
  );
};
